// Campaign & PVE Buttons

import React from "react";
import { socket } from "@/services/socketService";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { useLobbyStore } from "@/stores/useLobbyStore";

export default function BottomCenter() {
  const { isMatchking, room, setIsMatchking, setRoom } = useLobbyStore();
  const { currentRoom, players } = room || { currentRoom: null, players: [] };

  // Nút tạo phòng
  const handlerCreateRoom = () => {
    // In room thì rời room
    if (!!currentRoom) {
      socket.emit("leave_room");
      setRoom(null, []);
      return;
    }

    // Out room thì create room
    socket.emit("create_room", (data: any) => {
      const success = data.success as boolean;
      if (success) {
        setRoom(data.roomId, data.players);
        toast.success(`Tạo phòng thành công! RoomId: ${data.roomId}`);
      } else {
        // Tạo phòng thất bại
        toast.error(data.message);
      }
    });
  };
  // form tìm room
  const handleSubmitSearchRoom = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Khởi tạo FormData từ form hiện tại
    const formData = new FormData(e.currentTarget);

    const username = formData.get("searchRoom") as string;

    if (username) {
      const roomId = `room_${username}`;
      socket.emit("join_room", { roomId }, (res: any) => {
        const success = res.success as boolean;
        if (success) {
          toast.success(res.message);
        } else {
          toast.error(res.message ? res.message : "Lỗi!");
        }
      });
    } else {
      toast.error("Chưa nhập tên chủ phòng!");
    }
  };
  // Nút ghép trận
  const handlerS = () => {
    if (isMatchking) return;

    socket.emit("find_match", () => {
      console.log(`User ${socket.id} đang ghép trận...`);
      setIsMatchking(true);
    });
  };

  return (
    <div className="flex flex-col justify-between h-full">
      {/* Giao diện phòng ghép */}
      {players && players.length > 0 && !!currentRoom && (
        <div>
          <h4>Đang đang ở phòng: {currentRoom}</h4>
          <p>Thành viên thứ 1: {players[0]} - chủ phòng</p>
          <p>Thành viên thứ 2: {players[1]}</p>
        </div>
      )}

      {/* Khu nút thao tác */}
      <div className="flex flex-row gap-5 justify-center">
        <Button variant="secondary" onClick={handlerCreateRoom}>
          {!!currentRoom ? "Rời phòng" : "Tạo phòng"}
        </Button>

        <form onSubmit={handleSubmitSearchRoom}>
          <Input
            type="text"
            name="searchRoom"
            placeholder="Username chủ phòng..."
            className="w-44 mr-4"
          />
          <Button type="submit" variant="ghost" disabled={!!currentRoom}>
            Tìm phòng
          </Button>
        </form>

        <Button disabled={isMatchking}>
          {isMatchking ? "Đang ghép..." : "Ghép trận"}
        </Button>
      </div>
    </div>
  );
}
