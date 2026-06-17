// Friends List
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FriendList } from "./friendList";

export default function MiddleLeft() {
  return (
    <>
      <Tabs defaultValue="friend-list">
        <TabsList variant="line">
          <TabsTrigger value="friend-list">Bạn bè</TabsTrigger>
          <TabsTrigger value="friend-request">Kết bạn</TabsTrigger>
          <TabsTrigger value="online-player">Online</TabsTrigger>
        </TabsList>

        {/* friend-list */}
        <TabsContent value="friend-list">
          <FriendList />
        </TabsContent>

        {/* friend-request */}
        <TabsContent value="friend-request">friend-request</TabsContent>

        {/* online-player */}
        <TabsContent value="online-player">online-player</TabsContent>
      </Tabs>
    </>
  );
}
