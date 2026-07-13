export interface Room {
  currentRoom: string | null;
  players: string[];
}

export interface Lobby {
  isInfoUserFormOpen: boolean;
  onlineUsers: number;
  inGameUser: number;
  isMatchking: boolean;
  room: Room;
  setIsInfoUserFormOpen: () => void;
  setOnlineUser: (onlineUsers: number) => void;
  setInGameUser: (inGameUser: number) => void;
  setIsMatchking: (isMatchking: boolean) => void;
  setRoom: (currentRoom: string | null, players: string[]) => void;
}
