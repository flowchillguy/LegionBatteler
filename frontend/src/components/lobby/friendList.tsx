import { useAuthStore } from "@/stores/useAuthStore";
import { Card } from "../ui/card";

export function FriendList() {
  const { friends } = useAuthStore();

  return (
    <>
      <Card className="bg-transparent">{JSON.stringify(friends)}</Card>
    </>
  );
}
