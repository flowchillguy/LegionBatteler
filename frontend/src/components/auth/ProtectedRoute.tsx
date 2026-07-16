import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router";
import { useGameStore } from "@/stores/useGameStore";
import { socket } from "@/services/socketService";

const ProtectedRoute = () => {
  const { accessToken, user, loading, refresh, fetchMe } = useAuthStore();
  const [starting, setStarting] = useState(true);
  const navigate = useNavigate();

  const init = async () => {
    try {
      let currentToken = accessToken;

      if (!currentToken) {
        await refresh();
        currentToken = useAuthStore.getState().accessToken;
      }

      if (currentToken && !user) {
        await fetchMe();
      }

      // GỌI SOCKET ĐỂ KIỂM TRA TRẬN ĐẤU CŨ
      socket.emit("check_active_game", (res: any) => {
        if (res && res.success) {
          const { gameRoomId, players, status } = res;

          // Cập nhật lại Store y như lúc mới ghép trận xong
          useGameStore.setState({ gameRoomId, players, status });

          // Điều hướng thẳng vào game
          navigate("/game");
        }
      });
    } catch (error) {
      console.error("Lỗi khởi tạo auth:", error);
      navigate("/signin", { replace: true }); // Sửa lỗi gọi component ảo trong catch
    } finally {
      setStarting(false);
    }
  };

  useEffect(() => {
    init();
  }, []);

  if (starting || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Đang tải trang ...
      </div>
    );
  }

  if (!accessToken) {
    return <Navigate to="/trial" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
