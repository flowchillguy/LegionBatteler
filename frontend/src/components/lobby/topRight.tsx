// Leaderboard Button & Settings
import { Settings, Trophy, Sun, Moon, Info, LogOut } from "lucide-react";
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
import { useLobby } from "@/stores/useLobby";

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

  const { setIsInfoUserFormOpen } = useLobby();

  return (
    <>
      <div className="w-full h-full flex gap-2">
        {/* Leaderboard */}
        <Button
          variant="outline"
          className="flex-1 h-full flex flex-col justify-center gap-1"
        >
          <Trophy className="w-6 h-6" />
          <span className="text-lime-400">Rank #47</span>
          <span className="text-xs text-slate-400">Leaderboard</span>
        </Button>

        <div className="h-full flex flex-col">
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
              <DropdownMenuItem className="cursor-pointer" onSelect={setIsInfoUserFormOpen}>
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
