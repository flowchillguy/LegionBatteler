import type { Friend, FriendRequest, User } from "./user";

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  loading: boolean;

  setAccessToken: (accessToken: string) => void;

  clearState: () => void;

  signUp: (
    username: string,
    password: string,
    confirmpassword: string,
    email: string,
    firstName: string,
    lastName: string,
  ) => Promise<boolean>;

  signIn: (username: string, password: string) => Promise<boolean>;
  signOut: () => Promise<boolean>;
  fetchMe: () => Promise<void>;
  refresh: () => Promise<void>;
  patchProfile: (
    bio: string,
    displayName: string,
    email: string,
    password: string,
    passwordComfirm: string,
  ) => Promise<boolean>;
  getPassword: (username: string) => Promise<any>;
}

export interface ThameState {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (dark: boolean) => void;
}

export interface Message {
  _id: string;
  senderId: string;
  content: string | null;
  updatedAt?: string | null;
  createdAt: string;
  isOwn?: boolean;
}

export interface GeneralChatState {
  messages: {
    items: Message[];
    hasMore: boolean; // infinite-scroll
    nextCursor?: string | null; // Phân trang
  };
  loading: boolean;
  getConversation: (hasMore: boolean, nexCursor?: string) => Promise<void>;
  sendMessage: (message: string) => Promise<void>;
  initSocketListener: () => any
}

export interface FriendState {
  friends: Friend[];
  sentFriendRequest: FriendRequest[];
  receivedFriendRequest: FriendRequest[];

  getAllFriends: () => Promise<void>;
  sendFriendRequest: (username: string, message: string) => Promise<void>;
  getFriendRequests: () => Promise<void>;
  acceptFriendRequest: (idFriend: string) => Promise<void>;
  declineFriendRequest: (idFriend: string) => Promise<void>;
  unfriend: (friendshipId: string) => Promise<void>;
}
