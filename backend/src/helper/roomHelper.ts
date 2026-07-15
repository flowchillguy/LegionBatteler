import { Server, Socket } from "socket.io";
import type { CustomRoom } from "../models/Game.js";

// === HÀM HỖ TRỢ roomHandler.ts === ///

// Kiểm tra xem user có đang ở trong bất kỳ phòng nào không (chống nhiều thiết bị)
export const getUserCurrentRoomId = (
  uname: string,
  activeRooms: Record<string, CustomRoom>,
) => {
  for (const roomId in activeRooms) {
    if (activeRooms[roomId]?.players.includes(uname)) {
      console.log(`[ROOM] User ${uname} đang ở roomId ${roomId}.`);
      return roomId;
    }
  }

  console.log(`[ROOM] User ${uname} đang không trong room nào.`);
  return null;
};

// Hàm dọn dẹp khi user rời phòng
export const cleanRooms = (
  uname: string,
  activeRooms: Record<string, CustomRoom>,
  io: Server,
) => {
  console.log(`[ROOM] user ${uname} chạy cleanRooms...`);
  const roomId = getUserCurrentRoomId(uname, activeRooms);
  if (!roomId) {
    console.log(`[ROOM] Room không tồn tại.`);
    return;
  }

  const room = activeRooms[roomId]!;

  // TRƯỜNG HỢP: Người rời phòng CHÍNH LÀ HOST
  if (room?.hostUsername === uname) {
    console.log(`Chủ phòng ${uname} đã rời đi. Tiến hành hủy phòng ${roomId}.`);

    // Gửi event thông báo cho thành viên còn lại biết phòng đã bị hủy
    io.to(roomId).emit("room_destroyed", {
      message: "Chủ phòng đã rời đi, phòng bị hủy!",
    });

    // Xóa phòng khỏi bộ nhớ hệ thống
    delete activeRooms[roomId];
  }

  // TRƯỜNG HỢP: Người rời phòng là thành viên thường
  room.players = room.players.filter((u) => u !== uname);
  if (room.players.length <= 0) {
    delete activeRooms[roomId];
  } else {
    io.to(roomId).emit("room_updated", {
      roomId,
      players: room.players,
      message: `${uname} đã rời phòng!`,
    });
  }
  console.log(`User ${uname} đã rời roomId ${roomId}`);
};
