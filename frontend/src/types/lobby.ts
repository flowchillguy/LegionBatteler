export interface Lobby {
  isInfoUserFormOpen: boolean;
  setIsInfoUserFormOpen: () => void;
  onlineUsers: number;
  inGameUser: number;
  setOnlineUser: (onlineUsers: number) => void;
  setInGameUser: (inGameUser: number) => void;
}
