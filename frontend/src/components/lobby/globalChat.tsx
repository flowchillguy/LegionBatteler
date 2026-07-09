// Global Chat
import { useEffect, useRef, useState } from "react";
import { useChatStore } from "@/stores/useChatStore";
import { socket } from "@/services/socketService";
import { Button } from "../ui/button";
import { useAuthStore } from "@/stores/useAuthStore";

export default function GlobalChat() {
  const {
    messages,
    loading,
    getConversation,
    sendMessage,
    initSocketListener,
  } = useChatStore();
  const [text, setText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Khởi tạo lấy tin nhắn và kết nối socket
  useEffect(() => {
    getConversation(messages.hasMore, messages.nextCursor || undefined);

    // Gọi hàm lắng nghe socket ở đây để nhận tin nhắn mới
    if (initSocketListener) {
      initSocketListener();
    }

    // Cleanup khi component unmount
    return () => {
      socket.off("receive_message");
    };
  }, []);

  // Cuộn xuống cuối
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [messages.items]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    await sendMessage(text);
    setText("");
  };

  const currentUserId = useAuthStore.getState().user?._id;

  return (
    <div className="flex flex-col h-full max-h-[500px] w-full max-w-md bg-transparent border-border">
      {/* Nơi đọc tin nhắn đến */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {loading && messages.items.length === 0 && (
          <div className="text-center text-sm text-muted-foreground py-2">
            Đang tải tin nhắn...
          </div>
        )}

        {messages.items.map((msg: any, index: number) => {
          const senderUserId = msg.senderId?._id || msg.senderId;

          const isMe = msg.isMe || senderUserId === currentUserId;

          const senderName = msg.senderId?.displayName || "Người dùng";
          const messageText = msg.content || "";

          return (
            <div
              key={msg._id || index}
              className={`flex flex-col max-w-[75%] text-sm w-fit ${
                isMe ? "self-end items-end" : "self-start items-start"
              }`}
            >
              {!isMe && (
                <span className="text-[11px] font-bold text-muted-foreground mb-1 ml-1">
                  {senderName}
                </span>
              )}

              <p
                className={`break-words whitespace-pre-wrap leading-relaxed rounded-xl px-3 py-2 ${
                  isMe
                    ? "bg-primary text-primary-foreground rounded-br-sm" 
                    : "bg-muted text-foreground rounded-bl-sm" 
                }`}
              >
                {messageText}
              </p>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Nơi nhắn tin */}
      <form
        onSubmit={handleSend}
        className="p-1 border-t border-border bg-transparent flex gap-2 shrink-0"
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Nhập nội dung chat..."
          className="flex-1 px-3 py-2 border border-input bg-transparent rounded-full text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
        <Button type="submit" variant="default" className="rounded-full px-5">
          Gửi
        </Button>
      </form>
    </div>
  );
}