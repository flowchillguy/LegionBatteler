import Logout from "@/components/auth/logout";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStore";
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
  return (
    <div>
      {user?.username}
      <Logout />
      <Button onClick={handleOnClickTest}>TEST</Button>
    </div>
  );
};

export default MainLobbyPage;
