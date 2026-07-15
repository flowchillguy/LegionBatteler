import { Server, Socket } from "socket.io";
import type { GameSession } from "../models/Game.js";

export const registerMatch = (
  player1SocketId: string,
  player2SocketId: string,
  activeGames: Record<string, GameSession>,
  io: Server,
) => {
  console.log(
    `[MATCHMAKING] Tiến hành ghép trận ${player1SocketId} và ${player2SocketId}...`,
  );

  const player1Socket = io.sockets.sockets.get(player1SocketId);
  const player2Socket = io.sockets.sockets.get(player2SocketId);

  // 1. Kiểm tra socket
  if (!player1Socket || !player2Socket) {
    console.log(
      `[MATCHMAKING] Tiến hành ghép trận ${player1SocketId} và ${player2SocketId} thất bại 1.`,
    );
    return { success: false, message: "Đối thủ đã ngắt kết nối." };
  }

  const uname1 = player1Socket.data?.user?.username;
  const uname2 = player2Socket.data?.user?.username;

  // 2. Kiểm tra dữ liệu user
  if (!uname1 || !uname2) {
    console.log(
      `[MATCHMAKING] Tiến hành ghép trận ${player1SocketId} và ${player2SocketId} thất bại 2.`,
    );
    return {
      success: false,
      message: "Lỗi dữ liệu người chơi. Vui lòng ghép lại!",
    };
  }

  // 3. Tiến hành xử lý logic ghép trận khi mọi điều kiện đã thỏa mãn
  const gameRoomId = `game_${uname1}_${uname2}`;

  player1Socket.join(gameRoomId);
  player2Socket.join(gameRoomId);

  activeGames[gameRoomId] = {
    gameRoomId,
    players: [uname1, uname2],
    status: "playing",
    matchData: null,
  };

  io.to(gameRoomId).emit("match_found", {
    gameRoomId,
    players: [uname1, uname2],
    status: "playing",
  });

  console.log(
    `[MATCHMAKING] Tiến hành ghép trận ${player1SocketId} và ${player2SocketId} thành công.`,
  );

  // 4. Return thành công ở cuối cùng
  return { success: true, message: "Ghép thành công! Đang vào trận..." };
};
