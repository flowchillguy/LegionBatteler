import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";
const ProtectedRoute = () => {
  const { accessToken, user, loading, refresh, fetchMe } = useAuthStore();
  const [starting, setStarting] = useState(true);

  // Khi trang vừa được tải/ tải lại
  const init = async () => {
    // Có thể mất khi refresh trang
    if (!accessToken) {
      await refresh();
    }

    if (accessToken && !user) {
      await fetchMe();
    }

    setStarting(false);
  };

  // Tự chạy mỗi lần load trang
  useEffect(() => {
    init();
  }, []);

  if (starting || loading) {
    return (
      <div className="flex h-screen item-center justify-center">
        Đang tải trang ...
      </div>
    );
  }

  if (!accessToken) {
    return <Navigate to="/trial" replace />;
  }

  return <Outlet></Outlet>;
};

export default ProtectedRoute;
