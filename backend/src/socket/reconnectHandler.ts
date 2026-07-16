import { Server, Socket } from "socket.io";
import { activeGames } from "./gameHandler.js";
import { getGameRoomIdCurrent } from "../helper/matchmakingHelper.js";

export const registerReconnectHandler = (io: Server, socket: Socket) => {
  socket.on("check_active_game", (callback) => {
    const uname = socket.data?.user?.username;
    if (!uname) return;

    const gameRoomId = getGameRoomIdCurrent(uname, activeGames);

    if (gameRoomId) {
      socket.join(gameRoomId);

      const players = activeGames[gameRoomId]?.players;
      const status = activeGames[gameRoomId]?.status;

      if (callback) {
        callback({ success: true, gameRoomId, players, status });
      }
      console.log(`User ${uname} đã F5 và quay lại trận ${gameRoomId}`);
    } else {
      // Trả về false nếu không có trận nào dở dang
      if (callback) {
        callback({ success: false });
      }
    }
  });
};
