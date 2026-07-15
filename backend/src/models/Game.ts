export interface CustomRoom {
  id: string;
  hostUsername: string;
  players: string[]; // Lưu danh sách username (Max 2)
}

export interface PlayerData {
  username: string;
  gold: number;
}

export interface InGameState {
  players: Record<string, PlayerData>; // key = username
  castle: { hp: number; level: number };
}

export interface GameSession {
  gameRoomId: string;
  players: string[];
  status: "playing" | "ended";
  matchData: InGameState | null; // Để tạm null để khỏi khai báo lúc ghép trận
}
