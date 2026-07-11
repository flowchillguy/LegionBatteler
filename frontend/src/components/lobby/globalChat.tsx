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
  
  // Ref mới để trỏ vào thẻ div bao bọc toàn bộ khung cuộn
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // State đánh dấu xem người dùng có đang vuốt lên xem tin cũ không
  const [isScrolledUp, setIsScrolledUp] = useState(false);

  useEffect(() => {
    getConversation(messages.hasMore, messages.nextCursor || undefined);

    if (initSocketListener) {
      initSocketListener();
    }

    return () => {
      socket.off("receive_message");
    };
  }, []);

  // Effect tự động cuộn xuống cuối
  useEffect(() => {
    // CHỈ tự động cuộn nếu người dùng ĐANG Ở ĐÁY màn hình
    // Nếu họ đang vuốt lên xem tin cũ (isScrolledUp = true), ta mặc kệ để họ đọc
    if (!isScrolledUp) {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [messages.items]);

  // Xử lý sự kiện gửi tin nhắn
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    await sendMessage(text);
    setText("");
    
    // Ép buộc trượt xuống dưới cùng khi CHÍNH MÌNH vừa gửi tin nhắn mới
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 50);
  };

  // HÀM MỚI: Xử lý cuộn chuột đa nhiệm
  const handleScroll = async (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = container;

    // 1. Kiểm tra xem có đang vuốt lên không (cách đáy hơn 150px)
    const isNearBottom = scrollHeight - scrollTop - clientHeight <= 150;
    setIsScrolledUp(!isNearBottom);

    // 2. Kích hoạt lấy tin cũ khi cuộn chạm nóc (scrollTop === 0)
    if (scrollTop === 0 && messages.hasMore && !loading) {
      // Lưu lại chiều cao của khung chat TRƯỚC KHI có thêm tin nhắn cũ
      const prevScrollHeight = scrollHeight;

      // Đợi lấy tin cũ xong
      await getConversation(messages.hasMore, messages.nextCursor || undefined);

      // Tính toán lại để đẩy thanh cuộn xuống đúng vị trí người dùng đang đọc
      // Dùng setTimeout nhỏ để đợi React render xong đống tin nhắn cũ vào DOM
      setTimeout(() => {
        if (chatContainerRef.current) {
          const newScrollHeight = chatContainerRef.current.scrollHeight;
          chatContainerRef.current.scrollTop = newScrollHeight - prevScrollHeight;
        }
      }, 50);
    }
  };

  const currentUserId = useAuthStore.getState().user?._id;

  return (
    <div className="flex flex-col h-full max-h-[500px] w-full max-w-md bg-transparent border-border">
      
      {/* Nơi đọc tin nhắn đến */}
      <div 
        ref={chatContainerRef} // Gắn ref vào đây để tính toán chiều cao
        onScroll={handleScroll} // Lắng nghe sự kiện cuộn
        className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 relative"
      >
        {loading && (
          <div className="text-center text-sm text-muted-foreground py-2 font-medium">
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
                className={`break-words whitespace-pre-wrap max-w-full leading-relaxed rounded-xl px-3 py-2 ${
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