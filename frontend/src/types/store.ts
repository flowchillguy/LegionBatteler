import type { Message } from "./chat";
import type { User } from "./user";

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  loading: boolean;
  friends: any;

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
  getFriendList: () => Promise<void>;
}

export interface ThameState {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (dark: boolean) => void;
}

export interface GeneralChatState {
  messages: {
    items: Message[];
    hasMore: boolean; // infinite-scroll
    nextCursor?: string | null; // Phân trang
  };
  loading: boolean;
  reset: () => void;
}
