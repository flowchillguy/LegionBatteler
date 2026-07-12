import { Server, Socket } from "socket.io";

interface CustomRoom {
  id: string;
  hostId: string;
  players: string[]; // Max 2 people
}

const activeRooms: Record<string, CustomRoom> = {};
const waitingQueue: string[] = [];

export const registerMatchmakingHandlers = (io: Server, socket: Socket) => {
  // Tạo phòng
  socket.on("create_room", (callback) => {
    const username = socket.data.user.username;
    const roomId = `room_${username}`;

    activeRooms[roomId] = {
      id: roomId,
      hostId: username,
      players: [username],
    };

    socket.join(roomId);
    console.log(`User ${username} đã tạo phòng: ${roomId}`);

    // Phản hồi fe
    if (callback) {
      callback({ success: true, roomId, players: [username] });
    }
  });

  // Yêu cầu vào trực tiếp phòng của user khác
  socket.on("join_room", ({ roomId }, callback) => {
    const username = socket.data.user.username;
    const room = activeRooms[roomId];

    if (!room) {
      if (callback) {
        callback({ success: false, message: "Phòng không tồn tại!" });
        return;
      }
    } else if (room.players.length >= 2) {
      if (callback) {
        callback({ success: false, message: "Phòng đã đầy!" });
      }
    }

    room?.players.push(username);
    socket.join(roomId);

    console.log(`User ${username} đã vào phòng ${roomId}`);

    if (callback) {
      callback({
        success: true,
        roomId,
        message: `User ${username} đã vào phòng.`,
      });
    }
  });

  // gửi lời mời user khác vào phòng của mình (chỉ gửi thông báo)

  // Yêu cầu ghép trận xét 2 trường hợp đơn/phòng đấu

  // Gửi tin nhắn trong room

  // Thoát room

  // Kick khỏi room

  // Hàm bổ trợ
  // Logic ghép trận phòng 2 người thì vào luôn, 1 người thì hủy và gọi logic ghép đơn

  // Logic ghép trận đơn

  // Logic thoát/treo máy

  // Hàm hủy/rời phòng
};
