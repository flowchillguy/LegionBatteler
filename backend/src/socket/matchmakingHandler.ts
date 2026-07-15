import { Server, Socket } from "socket.io";
import { getSocketId } from "../config/socket.js";
import { activeGames } from "./gameHandler.js";
import { cleanRooms, getUserCurrentRoomId } from "../helper/roomHelper.js";
import { activeRooms } from "./roomHandler.js";
import { registerMatch } from "../helper/matchmakingHelper.js";

const waitingQueue: string[] = []; // Lưu socket.id để ghép trận

export const registerMatchmakingHandlers = (io: Server, socket: Socket) => {
  const username = socket.data?.user?.username;

  // tìm chận
  socket.on("find_match", (callback) => {
    console.log(`User ${username} tiếng hành ghép trận!`);

    const roomId = getUserCurrentRoomId(username, activeRooms);

    // User đang trong room
    if (roomId) {
      const room = activeRooms[roomId];

      // Chỉ host mới có quyền ghép trận
      if (room?.hostUsername !== username) {
        if (callback) {
          callback({ success: false, message: "Chỉ host mới có thể bắt đầu!" });
        }
        return;
      }

      // Room đủ 2 người thì ghép luôn
      if (room?.players.length === 2) {
        // Lấy socket id của 2 người
        const player1SocketId = getSocketId(room.players[0]!);
        const player2SocketId = getSocketId(room.players[1]!);

        const { success, message } = registerMatch(
          player1SocketId as string,
          player2SocketId as string,
          activeGames,
          io,
        );

        if (success) {
          if (callback) {
            callback({ success, message });
          }
        }
        delete activeRooms[roomId]; // Xóa phòng chờ
        return;
      } else {
        // Không đủ 2 người thì xóa room ra ghép đơn
        cleanRooms(username, activeRooms, io);
      }
    }

    // Đẩy vào hàng đợi ghép
    if (!waitingQueue.includes(socket.id)) {
      waitingQueue.push(socket.id);
    }

    // Tiến hành ghép
    if (waitingQueue.length >= 2) {
      // Lấy id socket của 2 players
      const player1SocketId = waitingQueue.shift()!;
      const player2SocketId = waitingQueue.shift()!;

      // logic ghep 2 người
      const { success, message } = registerMatch(
        player1SocketId,
        player2SocketId,
        activeGames,
        io,
      );
      if (success) {
        if (callback) {
          callback({ success, message });
        }
      }
    } else {
      if (callback) {
        callback({ success: true, message: "Đang tìm đối thủ..." });
      }
    }
  });

  // Hủy ghép trận hoặc ngắt kết nối
  const handleLeaveOrDisconnect = () => {
    console.log(`User ${username} rời khỏi hàng đợi ghép trận.`);
    const qIndex = waitingQueue.indexOf(socket.id);
    if (qIndex !== -1) waitingQueue.splice(qIndex, 1);

    cleanRooms(username, activeRooms, io); // Dọn phòng nếu đang ở trong phòng
  };

  socket.on("cancel_find_match", handleLeaveOrDisconnect);
  socket.on("disconnect", handleLeaveOrDisconnect);
};
