import { Socket, Server } from "socket.io";
import { getSocketId } from "../config/socket.js";

import type { CustomRoom } from "../models/Game.js";
import { cleanRooms, getUserCurrentRoomId } from "../helper/roomHelper.js";

export const activeRooms: Record<string, CustomRoom> = {};

export const registerRoomHandler = (io: Server, socket: Socket) => {
  const username = socket.data?.user?.username;

  // Tạo phòng
  socket.on("create_room", (callback) => {
    if (getUserCurrentRoomId(username, activeRooms)) {
      if (callback)
        callback({ success: false, message: "Bạn đã ở trong một phòng khác!" });
      console.log(
        `[ROOM] user ${username} tạo phòng thất bại do đang ở trong một phòng khác.`,
      );
      return;
    }

    const roomId = `room_${username}`; // ID unique

    activeRooms[roomId] = {
      id: roomId,
      hostUsername: username,
      players: [username],
    };

    socket.join(roomId);

    if (callback) callback({ success: true, roomId, players: [username] });
    console.log(`[ROOM] User ${username} đã tạo phòng: ${roomId}.`);
  });

  // 2. Tham gia phòng trực tiếp
  socket.on("join_room", ({ roomId }, callback) => {
    if (getUserCurrentRoomId(username, activeRooms)) {
      console.log(
        `[ROOM] User ${username} không thể vào roomId ${roomId} do đang trong 1 room khác.`,
      );
      if (callback)
        callback({ success: false, message: "Bạn đã ở trong một phòng khác!" });
      return;
    }

    const room = activeRooms[roomId];

    if (!room) {
      console.log(
        `[ROOM] User ${username} không thể vào roomId ${roomId} vì không tồn tại roomId này.`,
      );
      if (callback)
        callback({ success: false, message: "Phòng không tồn tại!" });
      return;
    }

    if (room.players.length >= 2) {
      console.log(
        `[ROOM] User ${username} không thể vào roomId ${roomId} do room đã đầy.`,
      );
      if (callback) callback({ success: false, message: "Phòng đã đầy!" });
      return;
    }

    room.players.push(username);
    socket.join(roomId);

    console.log(`[ROOM] User ${username} đã vào phòng ${roomId}`);

    // Thông báo cho mọi người trong phòng
    io.to(roomId).emit("room_updated", {
      roomId,
      players: room.players,
      message: `${room.players[1]} đã vào phòng ${roomId}`,
    });

    if (callback) callback({ success: true, roomId, message: `Đã vào phòng.` });
  });

  // 3. Gửi lời mời
  socket.on("invite_room", ({ roomId, invitedUsername }, callback) => {
    console.log(
      `[ROOM] User ${username} đã mời ${invitedUsername} vào roomId ${roomId}`,
    );

    const room = activeRooms[roomId];
    const targetSocketId = getSocketId(invitedUsername);

    if (!room) {
      if (callback)
        callback({ success: false, message: "Phòng không tồn tại!" });
      return;
    }
    if (room.players.length >= 2) {
      if (callback) callback({ success: false, message: "Phòng đã đầy!" });
      return;
    }
    if (!targetSocketId) {
      if (callback) callback({ success: false, message: `User không online!` });
      return;
    }

    io.to(targetSocketId).emit("receive_invite_room", {
      roomId,
      sender: username,
    });

    if (callback)
      callback({ success: true, message: `Gửi lời mời thành công!` });
    return;
  });

  // 4. Rời phòng
  socket.on("leave_room", () => {
    const roomId = getUserCurrentRoomId(username, activeRooms);
    if (roomId) {
      console.log(`[ROOM] User ${username} rời roomId ${roomId}`);
      socket.leave(roomId);
      cleanRooms(username, activeRooms, io);
    }
  });
};
