// User Profile
import { useAuthStore } from "@/stores/useAuthStore";

export default function TopLeft() {
  const { user } = useAuthStore();
  return (
    <div>
      <h2>{user?.displayName}</h2>
      <p>@{user?.username}</p>
      <span>Điểm đánh giá: {user?.topPoints}</span>
    </div>
  );
}
