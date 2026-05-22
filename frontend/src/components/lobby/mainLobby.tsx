import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  Send,
  Trophy,
  UserPlus,
  Coins,
  Gem,
  Sparkles,
} from "lucide-react";

export default function App() {
  const mockFriends = [
    { id: 1, name: "Player1", status: "online" },
    { id: 2, name: "GamerX", status: "in-game" },
    { id: 3, name: "WarriorZ", status: "offline" },
    { id: 4, name: "NinjaKid", status: "online" },
    { id: 5, name: "DragonMaster", status: "in-game" },
  ];

  const mockChatMessages = [
    { id: 1, user: "Player1", message: "Anyone want to team up?" },
    { id: 2, user: "GamerX", message: "Looking for guild members!" },
    { id: 3, user: "System", message: "Server maintenance in 2 hours" },
    { id: 4, user: "WarriorZ", message: "GG everyone!" },
  ];

  return (
    <div className="dark min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      <div className="h-screen grid grid-cols-12 grid-rows-12 gap-4">
        {/* Top Left - User Profile */}
        <Card className="col-span-3 row-span-2 bg-slate-900/40 backdrop-blur-md border-slate-700/50 p-4">
          <div className="space-y-2">
            <h2 className="text-lime-400">DragonSlayer</h2>
            <p className="text-sm text-slate-400">@dragonslayer_pro</p>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="border-lime-500/50 text-lime-400"
              >
                Level 42
              </Badge>
              <Badge
                variant="outline"
                className="border-lime-500/50 text-lime-400"
              >
                Diamond Rank
              </Badge>
            </div>
          </div>
        </Card>

        {/* Top Center - Resources & Mini Chat */}
        <Card className="col-span-6 row-span-2 bg-slate-900/40 backdrop-blur-md border-slate-700/50 p-4">
          <div className="space-y-3">
            <div className="flex justify-around items-center">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-yellow-500" />
                <div>
                  <p className="text-xs text-slate-400">Gold</p>
                  <p className="text-lime-400">12,450</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Gem className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-slate-400">Silver</p>
                  <p className="text-lime-400">8,320</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <div>
                  <p className="text-xs text-slate-400">Diamond</p>
                  <p className="text-lime-400">156</p>
                </div>
              </div>
            </div>
            <div className="bg-slate-800/60 rounded p-2 overflow-hidden">
              <div className="animate-pulse text-xs text-slate-300">
                <span className="text-lime-400">[System]</span> Event: Double XP
                Weekend starts now! 🎉
              </div>
            </div>
          </div>
        </Card>

        {/* Top Right - Leaderboard Button & Settings */}
        <div className="col-span-3 row-span-2 flex gap-2">
          <Button
            variant="outline"
            className="flex-1 bg-slate-900/40 backdrop-blur-md border-lime-500/50 hover:bg-lime-500/20 h-full flex flex-col justify-center gap-1"
          >
            <Trophy className="w-6 h-6 text-lime-400" />
            <span className="text-lime-400">Rank #47</span>
            <span className="text-xs text-slate-400">Leaderboard</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="bg-slate-900/40 backdrop-blur-md border-slate-700/50 hover:bg-slate-700/40 h-full px-3"
              >
                <Settings className="w-6 h-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-slate-900 border-slate-700">
              <DropdownMenuItem className="hover:bg-slate-800 cursor-pointer">
                Logout
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-slate-800 cursor-pointer">
                Sound
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-slate-800 cursor-pointer">
                Change Info
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Left Middle - Friends List */}
        <Card className="col-span-3 row-span-6 bg-slate-900/40 backdrop-blur-md border-slate-700/50 p-4">
          <div className="h-full flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lime-400">Friends</h3>
              <Button
                size="sm"
                variant="ghost"
                className="hover:bg-lime-500/20"
              >
                <UserPlus className="w-4 h-4 text-lime-400" />
              </Button>
            </div>
            <ScrollArea className="flex-1">
              <div className="space-y-2 pr-4">
                {mockFriends.map((friend) => (
                  <div
                    key={friend.id}
                    className="flex items-center justify-between p-2 rounded bg-slate-800/40 hover:bg-slate-800/60 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          friend.status === "online"
                            ? "bg-lime-400"
                            : friend.status === "in-game"
                              ? "bg-yellow-400"
                              : "bg-slate-600"
                        }`}
                      />
                      <span className="text-sm">{friend.name}</span>
                    </div>
                    <span className="text-xs text-slate-500">
                      {friend.status}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </Card>

        {/* Center - Game Canvas Area */}
        <div className="col-span-6 row-span-6 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="text-6xl opacity-20">🐉</div>
            <p className="text-slate-600">Game Canvas Area</p>
          </div>
        </div>

        {/* Right Middle - Unit Shop */}
        <Card className="col-span-3 row-span-6 bg-slate-900/40 backdrop-blur-md border-slate-700/50 p-4">
          <div className="h-full flex flex-col items-center justify-center gap-4">
            <div className="text-4xl">⚔️</div>
            <h3 className="text-lime-400 text-center">Unit Shop</h3>
            <p className="text-xs text-slate-400 text-center">
              Buy troops and upgrades
            </p>
            <Button className="bg-lime-500 hover:bg-lime-600 text-black w-full">
              Open Shop
            </Button>
          </div>
        </Card>

        {/* Bottom Left - Global Chat */}
        <Card className="col-span-3 row-span-4 bg-slate-900/40 backdrop-blur-md border-slate-700/50 p-4">
          <div className="h-full flex flex-col gap-3">
            <h3 className="text-lime-400">Global Chat</h3>
            <ScrollArea className="flex-1">
              <div className="space-y-2 pr-4">
                {mockChatMessages.map((msg) => (
                  <div key={msg.id} className="text-sm">
                    <span className="text-lime-400">{msg.user}:</span>{" "}
                    <span className="text-slate-300">{msg.message}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="flex gap-2">
              <Input
                placeholder="Type message..."
                className="flex-1 bg-slate-800/60 border-slate-700 focus-visible:ring-lime-500"
              />
              <Button
                size="icon"
                className="bg-lime-500 hover:bg-lime-600 text-black"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Bottom Center - Campaign & PVE Buttons */}
        <div className="col-span-6 row-span-4 flex items-end gap-4 pb-4">
          <Button className="flex-1 h-24 bg-lime-500 hover:bg-lime-600 text-black flex flex-col justify-center gap-1 shadow-lg shadow-lime-500/30">
            <span className="text-xl">Campaign</span>
            <span className="text-xs opacity-80">Vượt ải</span>
          </Button>
          <Button className="flex-1 h-24 bg-lime-500 hover:bg-lime-600 text-black flex flex-col justify-center gap-1 shadow-lg shadow-lime-500/30">
            <span className="text-xl">PVE</span>
            <span className="text-xs opacity-80">Player vs Environment</span>
          </Button>
        </div>

        {/* Bottom Right - Rank (Matchmaking) Button */}
        <Card className="col-span-3 row-span-4 bg-gradient-to-br from-lime-600 to-lime-500 border-lime-400/50 p-6 cursor-pointer hover:from-lime-500 hover:to-lime-400 transition-all transform hover:scale-105 shadow-2xl shadow-lime-500/50">
          <div className="h-full flex flex-col items-center justify-center gap-4">
            <Trophy className="w-20 h-20 text-black" />
            <h2 className="text-3xl text-black">RANK</h2>
            <p className="text-sm text-black/80 text-center">
              Find Ranked Match
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
