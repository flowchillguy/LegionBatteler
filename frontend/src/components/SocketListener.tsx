import { socket } from "@/services/socketService";
import { useLobbyStore } from "@/stores/useLobbyStore";
import { useEffect } from "react";
import { toast } from "sonner";
import InviteToast from "./lobby/InviteToast";

export default function SocketListener() {
  const { setOnlineUser, setInGameUser, setRoom } = useLobbyStore();
  useEffect(() => {
    socket.off("online_users");
    socket.on("online_users", ({ onlineUsers }) => {
      setOnlineUser(onlineUsers);
    });

    socket.off("status_in_game");
    socket.on("status_in_game", ({ inGameCount }) => {
      setInGameUser(inGameCount);
    });

    socket.on("room_updated", ({ roomId, players, message }) => {
      setRoom(roomId, players);
      toast.success(message);
    });

    socket.off("receive_invite_room");
    socket.on("receive_invite_room", ({ roomId, sender }) => {
      const currentToastId = `invite_${roomId}_${sender}_${Date.now()}`;
      toast(
        <InviteToast
          sender={sender}
          roomId={roomId}
          toastId={currentToastId}
        />,
        {
          id: currentToastId, // Khóa ID này lại để không bị đè bởi toast khác
          duration: 20000, // Tự động đóng sau 20 giây
          position: "top-center",
        },
      );
    });

    socket.off("room_destroyed");
    socket.on("room_destroyed", (data) => {
      setRoom(null, []); // Cập nhật State để ẩn giao diện phòng
      toast.error(data?.message || "Chủ phòng đã rời đi, phòng đã bị hủy!");
    });

    return () => {
      socket.off("online_users");
      socket.off("status_in_game");
      socket.off("room_updated");
      socket.off("receive_invite_room");
      socket.off("room_destroyed");
    };
  }, []);

  return null;
}
