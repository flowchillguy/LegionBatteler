import { Server, Socket } from "socket.io";
import { getSocketId } from "../config/socket.js";

interface CustomRoom {
  id: string;
  hostUsername: string;
  players: string[]; // Lưu danh sách username (Max 2)
}

const activeRooms: Record<string, CustomRoom> = {};
const waitingQueue: string[] = []; // Lưu socket.id để ghép trận

export const registerMatchmakingHandlers = (io: Server, socket: Socket) => {
  const username = socket.data?.user?.username;

  // --------------------------------------------------------
  // HÀM HỖ TRỢ (HELPER FUNCTIONS)
  // --------------------------------------------------------

  // Kiểm tra xem user có đang ở trong bất kỳ phòng nào không (chống nhiều thiết bị)
  const getUserCurrentRoomId = (uname: string): string | null => {
    for (const roomId in activeRooms) {
      if (activeRooms[roomId]?.players.includes(uname)) {
        return roomId;
      }
    }
    return null;
  };

  // Hàm dọn dẹp khi user rời phòng
  const cleanRooms = (uname: string, io: Server) => {
    const roomId = getUserCurrentRoomId(uname);
    if (!roomId) return;

    const room = activeRooms[roomId]!;

    // TRƯỜNG HỢP: Người rời phòng CHÍNH LÀ HOST
    if (room.hostUsername === uname) {
      console.log(
        `Chủ phòng ${uname} đã rời đi. Tiến hành hủy phòng ${roomId}.`,
      );

      // Gửi event thông báo cho thành viên còn lại biết phòng đã bị hủy
      io.to(roomId).emit("room_destroyed", {
        message: "Chủ phòng đã rời đi, phòng bị hủy!",
      });

      // Xóa phòng khỏi bộ nhớ hệ thống
      delete activeRooms[roomId];
      return;
    }

    // TRƯỜNG HỢP: Người rời phòng là thành viên thường
    room.players = room.players.filter((u) => u !== uname);
    if (room.players.length <= 0) {
      delete activeRooms[roomId];
    } else {
      io.to(roomId).emit("room_updated", { roomId, players: room.players });
    }
  };

  // --------------------------------------------------------
  // XỬ LÝ PHÒNG (ROOM HANDLERS)
  // --------------------------------------------------------

  // 1. Tạo phòng
  socket.on("create_room", (callback) => {
    if (getUserCurrentRoomId(username)) {
      if (callback)
        callback({ success: false, message: "Bạn đã ở trong một phòng khác!" });
      return;
    }

    const roomId = `room_${username}`; // ID unique

    activeRooms[roomId] = {
      id: roomId,
      hostUsername: username,
      players: [username],
    };

    socket.join(roomId);

    if (callback) callback({ success: true, roomId, players: [username] });
    console.log(`User ${username} đã tạo phòng: ${roomId}`);
  });

  // 2. Tham gia phòng trực tiếp
  socket.on("join_room", ({ roomId }, callback) => {
    if (getUserCurrentRoomId(username)) {
      if (callback)
        callback({ success: false, message: "Bạn đã ở trong một phòng khác!" });
      return;
    }

    const room = activeRooms[roomId];

    if (!room) {
      if (callback)
        callback({ success: false, message: "Phòng không tồn tại!" });
      return;
    }

    if (room.players.length >= 2) {
      if (callback) callback({ success: false, message: "Phòng đã đầy!" });
      return;
    }

    room.players.push(username);
    socket.join(roomId);

    console.log(`User ${username} đã vào phòng ${roomId}`);

    // Thông báo cho mọi người trong phòng
    io.to(roomId).emit("room_updated", { roomId, players: room.players });

    if (callback) callback({ success: true, roomId, message: `Đã vào phòng.` });
  });

  // 3. Gửi lời mời
  socket.on("invite_room", ({ roomId, invitedUsername }, callback) => {
    const room = activeRooms[roomId];
    const targetSocketId = getSocketId(invitedUsername);

    if (!room) {
      if (callback)
        callback({ success: false, message: "Phòng không tồn tại!" });
      return;
    }
    if (room.players.length >= 2) {
      if (callback) callback({ success: false, message: "Phòng đã đầy!" });
      return;
    }
    if (!targetSocketId) {
      if (callback) callback({ success: false, message: `User không online!` });
      return;
    }

    io.to(targetSocketId).emit("receive_invite_room", {
      roomId,
      sender: username,
    });
    console.log(
      `User ${username} đã mời ${invitedUsername} vào phòng ${roomId}`,
    );
  });

  // 4. Rời phòng
  socket.on("leave_room", () => {
    const roomId = getUserCurrentRoomId(username);
    if (roomId) {
      socket.leave(roomId);
      cleanRooms(username, io);
    }
  });

  // --------------------------------------------------------
  // XỬ LÝ GHÉP TRẬN (MATCHMAKING HANDLERS)
  // --------------------------------------------------------

  socket.on("find_match", (callback) => {
    console.log(`User ${username} bấm ghép trận...`);

    const roomId = getUserCurrentRoomId(username);

    // TRƯỜNG HỢP A: User đang ở trong một phòng
    if (roomId) {
      const room = activeRooms[roomId]!;

      // Chỉ có host mới được quyền bấm ghép trận cho cả phòng
      if (room.hostUsername !== username) {
        if (callback)
          callback({
            success: false,
            message: "Chỉ chủ phòng mới được bắt đầu!",
          });
        return;
      }

      if (room.players.length === 2) {
        // Đủ 2 người: Ghép trực tiếp với nhau
        const gameRoomId = `game_${room.players[0]}_${room.players[1]}`;
        io.to(room.id).emit("match_found", {
          gameRoomId,
          players: room.players,
        });
        console.log(`Phòng ${room.id} đủ 2 người, tiến hành vào game...`);

        delete activeRooms[roomId]; // Xóa phòng chờ
        return;
      } else {
        // Có 1 người: Hủy phòng chờ và đẩy vào hàng đợi Queue
        cleanRooms(username, io);
      }
    }

    // TRƯỜNG HỢP B: Đẩy vào Queue (Dành cho solo hoặc phòng 1 người đã bị hủy ở trên)
    if (!waitingQueue.includes(socket.id)) {
      waitingQueue.push(socket.id);
    }

    // Kiểm tra hàng đợi xem có đủ 2 người solo không
    if (waitingQueue.length >= 2) {
      const player1SocketId = waitingQueue.shift()!;
      const player2SocketId = waitingQueue.shift()!;

      const player1Socket = io.sockets.sockets.get(player1SocketId);
      const player2Socket = io.sockets.sockets.get(player2SocketId);

      if (player1Socket && player2Socket) {
        const gameRoomId = `game_${player1Socket.data.user.username}_${player2Socket.data.user.username}`;
        player1Socket.join(gameRoomId);
        player2Socket.join(gameRoomId);

        // Phát sự kiện cho cả 2
        io.to(gameRoomId).emit("match_found", {
          gameRoomId,
          players: [
            player1Socket.data.user.username,
            player2Socket.data.user.username,
          ],
        });
      }
    } else {
      if (callback) callback({ success: true, message: "Đang tìm đối thủ..." });
    }
  });

  // Hủy ghép trận hoặc ngắt kết nối
  const handleLeaveOrDisconnect = () => {
    const qIndex = waitingQueue.indexOf(socket.id);
    if (qIndex !== -1) waitingQueue.splice(qIndex, 1);

    cleanRooms(username, io); // Dọn phòng nếu đang ở trong phòng
  };

  socket.on("cancel_find_match", handleLeaveOrDisconnect);
  socket.on("disconnect", handleLeaveOrDisconnect);
};
