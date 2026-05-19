import Logout from "@/components/auth/logout";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStore";
import { useThemeStore } from "@/stores/useThemeStore";
import React from "react";
import { toast } from "sonner";

const MainLobbyPage = () => {
  // Chỉ lấy ra thông tin user
  const user = useAuthStore((s) => s.user);

  // test
  const handleOnClickTest = async () => {
    try {
      await api.get("/users/test", { withCredentials: true });
      toast.success("Click test thành công!!!");
    } catch (error) {
      toast.error("Click test thất bại!!!");
      console.error(error);
    }
  };

  // theme light/dark
  const { isDark, toggleTheme } = useThemeStore();

  return (
    <>
      <div>
        {user?.username}
        <Logout />
        <Button onClick={handleOnClickTest}>TEST</Button>
      </div>
      {/* Nút thử sáng tối */}
      <div>
        <Button
          onClick={toggleTheme}
          className={isDark ? "bg-slate-800 text-white" : "bg-white text-black"}
        >
          {isDark ? "Chế độ Tối" : "Chế độ Sáng"}
        </Button>
      </div>
    </>
  );
};

export default MainLobbyPage;
