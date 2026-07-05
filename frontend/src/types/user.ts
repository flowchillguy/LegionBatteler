export interface User {
  _id: string;
  username: string;
  email: string;
  displayName: string;
  bio?: string;
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
