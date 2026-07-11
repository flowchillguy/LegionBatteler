import { socket } from "@/services/socketService";
import { useLobbyStore } from "@/stores/useLobbyStore";
import { useEffect } from "react";

export default function SocketListener() {
  const { setOnlineUser, setInGameUser } = useLobbyStore();
  useEffect(() => {
    socket.off("online_users");
    socket.on("online_users", ({ onlineUsers }) => {
      setOnlineUser(onlineUsers);
    });

    socket.off("status_in_game");
    socket.on("status_in_game", ({ inGameCount }) => {
      setInGameUser(inGameCount);
    });
  }, []);

  return () => {
    socket.off("online_users");
    socket.off("status_in_game");
  };
}
