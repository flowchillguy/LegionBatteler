import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { registerChatHandlers } from "../socket/chatHandler.js";
import { registerMatchmakingHandlers } from "../socket/matchmakingHandler.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import {
  initInGameCountInterval,
  registerCounterHandlers,
} from "../socket/presenceHandler.js";
import { registerGameHandlers } from "../socket/gameHandler.js";
import { registerRoomHandler } from "../socket/roomHandler.js";
import { registerReconnectHandler } from "../socket/reconnectHandler.js";

let io: Server;

// {userId: socketId}
const userSocketMap: Record<string, string> = {};

interface DecodedToken extends jwt.JwtPayload {
  userId: string;
}

export const initSocket = (server: HttpServer): Server => {
  io = new Server(server, {
    cors: {
      origin: "http://127.0.0.1:5173",
      methods: ["GET", "POST"],
    },
  });

  // Xác thực người dùng
  io.use(async (socket: Socket, next) => {
    try {
      const accessToken = socket.handshake.auth.token;

      if (!accessToken) {
        return next(new Error("Không có quyền kết nối socket.io!"));
      }

      const decoded = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET as string,
      ) as DecodedToken;

      const user = await User.findById(decoded.userId).select(
        "-hashedPassword",
      );

      if (!user) {
        return next(new Error("Người dùng không tồn tại!"));
      }

      socket.data.user = user;

      userSocketMap[user.username] = socket.id;

      next();
    } catch (error) {
      console.error("Lỗi xác thực Socket JWT:", error);
      return next(new Error("Access token hết hạn hoặc không đúng"));
    }
  });

  // Quản lý các sự kiện kết nối
  io.on("connection", (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    // Đếm số người online
    initInGameCountInterval(io);

    // Lắng nghe các event từ client
    // load lại trang
    registerReconnectHandler(io, socket);
    // chat tổng
    registerChatHandlers(io, socket);
    // ghép trận
    registerMatchmakingHandlers(io, socket);
    // phòng ghép trận
    registerRoomHandler(io, socket);
    // Đếm số người in game
    registerCounterHandlers(io, socket);
    // Trận đấu
    registerGameHandlers(io, socket);

    // Sự kiện ngắt kết nối
    socket.on("disconnect", () => {
      delete userSocketMap[socket.data.user.id];
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};

// Hàm getter để sử dụng io ở các file controller/route/service
export const getIO = (): Server => {
  if (!io) {
    throw new Error("Socket.io chưa được khởi tạo!");
  }

  return io;
};

// lấy socket id từ user id
export const getSocketId = (username: string) => {
  return userSocketMap[username];
};
