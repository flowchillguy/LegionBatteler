import { socket } from "@/services/socketService";
import { Button } from "@/components/ui/button";
import { useGameStore } from "@/stores/useGameStore";
import { Navigate } from "react-router";

export default function GamePage() {
  const { gameRoomId } = useGameStore();

  if (!gameRoomId) {
    // Navigate với replace để xóa lịch sử trang /game, ngăn user bấm nút "Back" trên trình duyệt
    return <Navigate to="/" replace />;
  }

  const handleSurrender = () => {
    if (gameRoomId) {
      socket.emit("surrender", { gameRoomId });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="mb-4">Trận đấu đang diễn ra</h1>
      <p className="mb-8">Phòng: {gameRoomId}</p>

      <Button variant="destructive" onClick={handleSurrender}>
        Đầu hàng (Quay về sảnh)
      </Button>
    </div>
  );
}
