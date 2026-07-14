import { Server, Socket } from "socket.io";
import type { GameSession } from "../models/Game.js";

// Ô nhớ các trận đang diễn ra {gameRoomId, GameSession}
export const activeGames: Record<string, GameSession> = {};

export const registerGameHandlers = (io: Server, socket: Socket) => {
  // Đầu hàng
  socket.on("surrender", ({ gameRoomId }) => {
    const username = socket.data?.user?.username;
    console.log(`User ${username} đã đầu hàng, phòng ${gameRoomId}`);

    // cập nhập trạng thái
    io.to(gameRoomId).emit("room_updated", {
      roomId: null,
      players: [],
      message: "Phòng đã hủy",
    });

    // thông báo endgame
    io.to(gameRoomId).emit("game_ended", {
      message: `Trận đấu kết thúc! ${username} đã đầu hàng.`,
      winner: activeGames[gameRoomId]?.players.find((p) => p !== username),
    });

    // Xóa trận đấu đã end giải phóng bộ nhớ
    delete activeGames[gameRoomId];

    // Đá 2 user khỏi socket room
    io.in(gameRoomId).socketsLeave(gameRoomId);
  });
};
