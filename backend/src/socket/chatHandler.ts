import { Server, Socket } from "socket.io";

export const registerChatHandlers = (io: Server, socket: Socket) => {
  
  // 1. Lắng nghe sự kiện gửi tin nhắn từ một Client cụ thể gửi lên
  socket.on("send_message", (data: { text: string }) => {
    console.log(`Socket: ${socket.id} đã gửi 1 tin nhắn thông qua Socket`);

    // Kiểm tra an toàn phòng trường hợp chưa qua Middleware hoặc mất data user
    if (!socket.data.user) {
      console.error("Lỗi: Không tìm thấy thông tin User trong Socket data!");
      return;
    }

    const realTimeMessage = {
      _id: new Date().getTime().toString(),
      content: data.text,
      senderId: {
        _id: socket.data.user._id,
        displayName: socket.data.user.displayName,
        username: socket.data.user.username
      },
      createdAt: new Date().toISOString()
    };

    io.emit("receive_message", realTimeMessage);
  });

};