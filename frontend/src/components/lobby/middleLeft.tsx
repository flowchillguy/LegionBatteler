// Friends List
import { UserPlus, UserRoundCheck, UserX } from "lucide-react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Card } from "../ui/card";
import type { Friend, FriendRequest } from "@/types/user";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFriendStore } from "@/stores/useFriendStore";
import { useState } from "react";

export default function MiddleLeft() {
  const {
    sentFriendRequest,
    receivedFriendRequest,
    friends,
    sendFriendRequest,
    unfriend,
    acceptFriendRequest,
    declineFriendRequest,
  } = useFriendStore();

  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");

  // Gửi yêu cầu kết bạn
  const handleSubmit = async (
    e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>,
  ) => {
    e.preventDefault();

    await sendFriendRequest(username, message);

    setUsername("");
    setMessage("");
  };

  // xóa bạn bè
  const handleDeleteFriend = async (friendshipId: string) => {
    await unfriend(friendshipId);
  };

  // Đồng ý kết bạn
  const handleAcceptFriendRequest = async (reqID: string) => {
    await acceptFriendRequest(reqID);
  };

  // Từ chối kết bạn
  const handleDeclineFriendRequest = async (reqID: string) => {
    await declineFriendRequest(reqID);
  };

  return (
    <>
      <Tabs defaultValue="friend-list" className="flex flex-col h-full">
        <TabsList variant="line">
          <TabsTrigger value="friend-list">Bạn bè</TabsTrigger>
          <TabsTrigger value="friend-request">Kết bạn</TabsTrigger>
        </TabsList>

        {/* friend-list */}
        <TabsContent value="friend-list">
          <ScrollArea className="flex-1 h-[250px]">
            <div className="space-y-2 pr-4">
              {friends.map((friend: Friend) => (
                <Card
                  key={friend._id}
                  className="flex justify-around items-center flex-row p-0 rounded card-friend transition-colors cursor-pointer gap-0"
                >
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-lg">{friend.displayName}</span>
                    <span className="text-sm">@{friend.username}</span>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteFriend(friend.friendshipId)}
                  >
                    <UserX />
                  </Button>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* friend-request */}
        <TabsContent
          value="friend-request"
          className="flex flex-col gap-2 flex-1 min-h-0"
        >
          <form onSubmit={handleSubmit} className="flex flex-row gap-1">
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

          {/* Danh sách đã gửi yêu cầu */}
          <div className="flex-1 overflow-y-auto pr-2 space-y-2">
            <h4>Yêu cầu kết bạn đã nhận</h4>
            {receivedFriendRequest.map((friend: any) => (
              <Card
                key={friend._id}
                className="flex justify-around items-center flex-row p-0 rounded card-friend transition-colors cursor-pointer gap-0"
              >
                <div className="flex flex-col items-center justify-center">
                  <span className="text-lg">{friend.from.displayName}</span>
                  <span className="text-sm">@{friend.from.username}</span>
                </div>

                <div className="flex gap-1">
                  <Button
                    variant="default"
                    onClick={() => handleAcceptFriendRequest(friend._id)}
                  >
                    <UserRoundCheck />
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDeclineFriendRequest(friend._id)}
                  >
                    <UserX />
                  </Button>
                </div>
              </Card>
            ))}
            <h4>Yêu cầu kết bạn đã đã gửi</h4>
            {sentFriendRequest.map((friend: any) => (
              <Card
                key={friend.id}
                className="flex items-center justify-center p-0 rounded card-friend transition-colors cursor-pointer gap-0"
              >
                <span className="text-lg">{friend.to.displayName}</span>
                <span className="text-sm">@{friend.to.username}</span>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
