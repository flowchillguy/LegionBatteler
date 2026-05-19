export interface Message {
  _id: string;
  senderId: string;
  content: string | null;
  updatedAt?: string | null;
  createdAt: string;
  isOwn?: boolean;
}