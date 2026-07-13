import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router"; // (Hoặc react-router-dom tùy bản bạn dùng)

const ProtectedRoute = () => {
  const { accessToken, user, loading, refresh, fetchMe } = useAuthStore();
  const [starting, setStarting] = useState(true);

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
    } catch (error) {
      console.error("Lỗi khởi tạo auth:", error);
      <Navigate to="/signin" replace />;
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
