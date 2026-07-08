import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { registerChatHandlers } from "../socket/chatHandler.js";
import { registerMatchmakingHandlers } from "../socket/matchmakingHandler.js";

let io: Server;

export const initSocket = (server: HttpServer): Server => {
  io = new Server(server, {
    cors: {
      origin: "http://127.0.0.1:5173",
      methods: ["GET", "POST"],
    },
  });

  // Quản lý các sự kiện kết nối
  io.on("connection", (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    // Lắng nghe các event từ client
    // chat tổng
    registerChatHandlers(io, socket);
    // ghép trận
    registerMatchmakingHandlers(io, socket);

    // Sự kiện ngắt kết nối
    socket.on("disconnect", () => {
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
