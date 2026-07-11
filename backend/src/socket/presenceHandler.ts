import { Server, Socket } from "socket.io";

let inGameCount = 0;

export const initInGameCountInterval = (io: Server) => {
  setInterval(() => {
    const onlineUsers = io.of("/").sockets.size;

    io.emit("online_users", {
      onlineUsers,
    });
  }, 3000);
};

export const registerCounterHandlers = (io: Server, socket: Socket) => {
  // Xử lý khi user vào trận
  socket.on("in_game", () => {
    inGameCount++;
    io.emit("status_in_game", {
      inGameCount,
    });
  });

  // Xử lý khi user thoát trận (hoặc kết thúc trận)
  socket.on("out_game", () => {
    if (inGameCount > 0) inGameCount--;

    io.emit("status_in_game", {
      inGameCount,
    });
  });

  // QUAN TRỌNG: Nếu user đang trong trận mà đột ngột tắt trình duyệt (disconnect)
  // Bạn cũng phải trừ số người trong trận đi, nếu không số inGameCount sẽ bị sai lệch.
  socket.on("disconnect", () => {
    // Lưu ý: Logic này cần nâng cấp thêm nếu bạn làm hệ thống Reconnect (kết nối lại).
    // Tạm thời ở mức cơ bản, nếu họ ngắt kết nối socket, ta coi như họ thoát game.
    // Bạn có thể cần một flag check xem user này trước đó có đang 'in_game' không rồi mới trừ.
  });
};
