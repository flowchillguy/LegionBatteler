export interface Game {
  gameRoomId: string | null;
  players: string[] | null; // username
  status: "playing" | "ended";
}
