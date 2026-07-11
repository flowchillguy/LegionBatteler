// Resources & Mini Chat
import { useAuthStore } from "@/stores/useAuthStore";
import { Trophy } from "lucide-react";

export default function TopCenter() {
  const { user } = useAuthStore();
  return (
    <div className="flex flex-row justify-around">
      <div className="flex flex-col items-center text-center gap-1">
        <h4>Coin</h4>
        <span>{user?.coin}</span>
      </div>

      <div className="flex flex-col items-center text-center gap-1">
        <h4>Tổng số trận</h4>
        <span>{user?.totalMatches}</span>
      </div>

      <div className="flex flex-col items-center text-center gap-1">
        <h4>Top server</h4>
        <span>hàm tính top server</span>
        <Trophy className="h-4 w-4 mt-1" />
      </div>

      <div className="flex flex-col items-center text-center gap-1">
        <h4>Win</h4>
        <span>{user?.win}</span>
      </div>

      <div className="flex flex-col items-center text-center gap-1">
        <h4>Loss</h4>
        <span>{user?.loss}</span>
      </div>
    </div>
  );
}
