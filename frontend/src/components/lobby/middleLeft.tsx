// Friends List
import { useAuthStore } from "@/stores/useAuthStore";
import { UserPlus } from "lucide-react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Card } from "../ui/card";
import type { Friend } from "@/types/user";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MiddleLeft() {
  const { friends } = useAuthStore();

  const handleSubmit = (username: string) => {
    //
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
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Nhập username bạn bè"
              className="border p-2 rounded"
            />
            <Button variant="ghost" type="submit">
              <UserPlus className="w-4 h-4 text-lime-400" />
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </>
  );
}
