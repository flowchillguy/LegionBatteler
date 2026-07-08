import { Server, Socket } from "socket.io";

export const registerChatHandlers = (io: Server, socket: Socket) => {
  // Nghe sự kiện gửi tin nhắn client gửi đến server
  socket.on("send_message", (data: { text: string }) => {
    console.log(`Socket: ${socket.id} đã gửi 1 tin nhắn`, data);

    // Gửi tin nhắn đến toàn bộ client
    io.emit("receive_message", data);
  });

  // thêm các event khác nếu cần
};
