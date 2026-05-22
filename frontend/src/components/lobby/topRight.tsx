// Leaderboard Button & Settings
import { Settings, Trophy, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useThemeStore } from "@/stores/useThemeStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui.figma/dropdown-menu";

export default function TopRight() {
  const { isDark, toggleTheme } = useThemeStore();

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
          onClick ={toggleTheme}
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

            <DropdownMenuContent className="">
              <DropdownMenuItem className="cursor-pointer">
                Logout
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                Sound
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                Change Info
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  );
}
