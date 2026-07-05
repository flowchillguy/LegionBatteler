// Friends List
import { useAuthStore } from "@/stores/useAuthStore";
import { UserPlus } from "lucide-react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Card } from "../ui/card";
import type { Friend } from "@/types/user";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { friendService } from "@/services/friendService";
import { toast } from "sonner";
import { useState } from "react";

export default function MiddleLeft() {
  const { friends } = useAuthStore();

  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (
    e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>,
  ) => {
    e.preventDefault();

    if (!username.trim()) {
      toast.error("Vui lòng nhập username!");
      return;
    }

    try {
      await friendService.sendFriendRequest(username, message);
      toast.success("Gửi lời mời thành công!");

      setUsername("");
      setMessage("");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Gửi lời mời thất bại, vui lòng thử lại!";
      toast.error(errorMessage);
    }
  };
  return (
    <>
      <Tabs defaultValue="friend-list">
        <TabsList variant="line">
          <TabsTrigger value="friend-list">Bạn bè</TabsTrigger>
          <TabsTrigger value="friend-request">Kết bạn</TabsTrigger>
        </TabsList>

        {/* friend-list */}
        <TabsContent value="friend-list">
          <ScrollArea className="flex-1 h-[100px]">
            <div className="space-y-2 pr-4">
              {friends.map((friend: Friend) => (
                <Card
                  key={friend._id}
                  className="flex items-center justify-center p-0 rounded card-friend transition-colors cursor-pointer gap-0"
                >
                  <span className="text-lg">{friend.displayName}</span>
                  <span className="text-sm">{friend.username}</span>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* friend-request */}
        <TabsContent value="friend-request">
          <form
            onSubmit={handleSubmit}
            className="flex flex-raw gap-1"
          >
            <div className="flex flex-col gap-1">
              <input
                type="text"
                placeholder="Nhập username bạn bè"
                className="border p-0 rounded"
                value={username}
                // 3. Lắng nghe sự kiện thay đổi để cập nhật State
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Ghi lại lời nhắn..."
                className="border p-0 rounded"
                value={message}
                // 3. Lắng nghe sự kiện thay đổi để cập nhật State
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <Button variant="ghost" type="submit">
              <UserPlus className="w-4 h-4 text-lime-400 scale-200" />
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </>
  );
}
