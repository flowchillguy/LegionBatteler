export interface User {
  _id: string;
  username: string;
  email: string;
  displayName: string;
  bio?: string;
  coin: number;
  win: number;
  loss: number;
  totalMatches: number;
  topPoints: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Friend {
  _id: string;
  username: string;
  displayName: string;
  friendshipId: string;
}

export interface FriendRequest {
  id: string;
  username: string;
  displayName: string;
}
