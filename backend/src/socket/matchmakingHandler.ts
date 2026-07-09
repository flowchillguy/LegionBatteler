import { Server, Socket } from "socket.io";

const waitingQueue: string[] = [];

export const registerMatchmakingHandlers = (io: Server, socket: Socket) => {
  // client tìm ghép trận
  socket.on("find_match", () => {
    console.log(`User ${socket.id} đang ghép trận...`);

    // tránh danh sách ghép trận client bị trùng
    if (!waitingQueue.includes(socket.id)) {
      waitingQueue.push(socket.id);
    }

    // ghép khi có ít nhất 2 người
    if (waitingQueue.length >= 2) {
      // Lấy 2 client đầu danh sách và xóa khỏi danh sách đợi
      const player1Id = waitingQueue.shift()!;
      const player2Id = waitingQueue.shift()!;

      // Lấy socket của client
      const player1Socket = io.sockets.sockets.get(player1Id);
      const player2Socket = io.sockets.sockets.get(player2Id);

      if (player1Socket && player2Socket) {
        // Tạo phòng 2 người
        const roomId = `room_${player1Id}`;

        player1Socket.join(roomId);
        player2Socket.join(roomId);

        console.log(`Tạo thành công room id: ${roomId}`);

        // Thông báo ghép trận
        io.to(roomId).emit("match_found", {
          roomId: roomId,
          players: [player1Id, player2Id],
        });
      }
    } else {
      // không đủ người ghép
      socket.emit("waiting_in_queue", { message: `Đang tìm đối thủ...` });
    }
  });

  // hủy trận/treo mạng
  const removeFromQueue = () => {
    const index = waitingQueue.indexOf(socket.id);
    if (index !== -1) {
      waitingQueue.splice(index, 1);
      console.log(`User ${socket.id} đã rời khỏi hàng đợi ghép trận.`);
    }
  };

  socket.on("cancel_find_match", removeFromQueue);
  socket.on("disconnect", removeFromQueue);

  // chat trong room
  socket.on("send_room_message", (data: { roomId: string; text: string }) => {
    io.to(data.roomId).emit("receive_room_message", {
      sender: socket.data.user.displayName,
      text: data.text,
    });
  });
};
