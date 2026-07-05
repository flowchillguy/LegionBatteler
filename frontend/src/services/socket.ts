import { io, Socket } from "socket.io-client";

// Khởi tạo 1 instance duy nhất cho toàn bộ ứng dụng
const socket: Socket = io("http://127.0.0.1:5000", {
  autoConnect: true,
});

export default socket;
