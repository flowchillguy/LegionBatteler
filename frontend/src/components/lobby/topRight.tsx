// Leaderboard Button & Settings
import { Settings, Sun, Moon, Info, LogOut } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { useThemeStore } from "@/stores/useThemeStore";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useLobbyStore } from "@/stores/useLobbyStore";

export default function TopRight() {
  const navigate = useNavigate();

  const { isDark, toggleTheme } = useThemeStore();

  const { signOut } = useAuthStore();

  const handleSignOut = async () => {
    try {
      const isSuccess = await signOut();
      if (isSuccess) {
        navigate("/signin");
      }
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    }
  };

  const { setIsInfoUserFormOpen, onlineUsers, inGameUser } = useLobbyStore();

  return (
    <>
      <div className="w-full h-full flex gap-2">
        {/* Leaderboard */}
        <div className="flex-1 h-full flex flex-col items-center justify-center gap-1">
          <h4>Tổng số người online</h4>
          <span className="text-lime-400">{onlineUsers}</span>
          <span className="text-xs text-slate-400">
            Có {inGameUser} người đang trong trận
          </span>
        </div>

        <div className="h-full flex flex-col gap-2">
          {/* Model dark/light */}
          <Button
            className="h-1/2 aspect-square flex-1 px-3"
            onClick={toggleTheme}
          >
            {isDark ? (
              <Sun className="scale-150" />
            ) : (
              <Moon className="scale-150" />
            )}
          </Button>

          {/* Settings */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-1/2 aspect-square flex-1 px-3"
              >
                <Settings className="w-6 h-6 scale-150" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="scale-150">
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={setIsInfoUserFormOpen}
              >
                <Info />
                Thông tin
              </DropdownMenuItem>

              {/* Logout */}
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={handleSignOut}
              >
                <LogOut />
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  );
}
