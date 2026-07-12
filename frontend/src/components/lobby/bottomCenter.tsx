// Campaign & PVE Buttons

import { socket } from "@/services/socketService";
import { Button } from "../ui/button";
import useToggle from "@/hooks/useToggle";

export default function BottomCenter() {
  const [isSearching, toggleSearch] = useToggle();

  const handlerCreateRoom = () => {
    if (isSearching) return;

    socket.emit("find_match", () => {
      console.log(`User ${socket.auth} đang ghép trận...`);
      console.log(isSearching);
      toggleSearch();
    });
  };

  return (
    <div className="flex justify-center items-end h-full">
      <div className="flex flex-row gap-5">
        <Button variant="secondary" onClick={handlerCreateRoom}>
          Tạo phòng
        </Button>

        <Button disabled={isSearching}>
          {isSearching ? "Đang ghép..." : "Ghép trận"}
        </Button>
      </div>
    </div>
  );
}
