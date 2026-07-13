import { socket } from "@/services/socketService";
import { useLobbyStore } from "@/stores/useLobbyStore";
import { useEffect } from "react";
import { toast } from "sonner";

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

    socket.on("room_updated", ({ roomId, players }) => {
      setRoom(roomId, players);
      toast.success(
        `User ${players?.[1] ? players[1] : "?"} đã vào phòng ${roomId}`,
      );
    });

    return () => {
      socket.off("online_users");
      socket.off("status_in_game");
    };
  }, []);

  return null;
}
