import { io } from "socket.io-client";
import { useAuthStore } from "@/stores/useAuthStore";

const SOCKET_URL = "http://localhost:3000";

export const socket = io(SOCKET_URL, {
  autoConnect: false, // Chưa kết nối ngay lập tức khi mở web
});

// Hàm trợ giúp để kích hoạt kết nối khi cần
export const connectSocket = () => {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    // Cập nhật lại Object auth với token mới nhất trước khi gọi connect
    socket.auth = { token };
    socket.connect();
    console.log("Đang tiến hành kết nối Socket...");
  }
};

// Hàm ngắt kết nối khi user Đăng xuất (Logout)
export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
    console.log("Đã ngắt kết nối Socket.");
  }
};