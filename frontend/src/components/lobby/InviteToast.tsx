import { Button } from "@/components/ui/button";
import { socket } from "@/services/socketService";
import { toast } from "sonner";

interface InviteToastProps {
  sender: string;
  roomId: string;
  toastId: string | number;
}

export default function InviteToast({
  sender,
  roomId,
  toastId,
}: InviteToastProps) {
  const handleDecline = () => {
    toast.dismiss(toastId);
  };

  const handleAccept = () => {
    socket.emit("join_room", { roomId }, (res: any) => {
      if (res.success) {
        toast.success("Đã tham gia phòng thành công!");
      } else {
        toast.error(res.message || "Không thể vào phòng!");
      }
    });
    toast.dismiss(toastId);
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <p className="text-sm font-medium">
        🎮 <strong>{sender}</strong> đã mời bạn vào phòng chơi!
      </p>
      <div className="flex flex-row gap-2 justify-end mt-1">
        <Button
          variant="destructive"
          size="sm"
          className="h-8 text-xs"
          onClick={handleDecline}
        >
          Từ chối
        </Button>
        <Button
          variant="default"
          size="sm"
          className="h-8 text-xs"
          onClick={handleAccept}
        >
          Đồng ý
        </Button>
      </div>
    </div>
  );
}
