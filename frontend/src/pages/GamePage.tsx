import { socket } from "@/services/socketService";
import { Button } from "@/components/ui/button";
import { useGameStore } from "@/stores/useGameStore";
import { Navigate } from "react-router";
import GameWrapper from "@/components/game/GameWrapper";

export default function GamePage() {
  const { gameRoomId } = useGameStore();

  if (!gameRoomId) {
    return <Navigate to="/" replace />;
  }

  const handleSurrender = () => {
    socket.emit("surrender", { gameRoomId });
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* CANVAT - GAME PHASER */}
      <GameWrapper roomId={gameRoomId} />

      <div className="absolute inset-0 z-10 pointer-events-none p-4">
        <p>Phòng {gameRoomId}</p>
        <Button
          variant="destructive"
          className="mt-8 pointer-events-auto"
          onClick={handleSurrender}
        >
          Đầu hàng (Quay về sảnh)
        </Button>
      </div>
    </div>
  );
}
