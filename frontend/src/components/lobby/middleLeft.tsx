// Friends List

import { UserPlus } from "lucide-react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";

export default function MiddleLeft() {
  const mockFriends = [
    { id: 1, name: "Player1", status: "online" },
    { id: 2, name: "GamerX", status: "in-game" },
    { id: 3, name: "WarriorZ", status: "offline" },
    { id: 4, name: "NinjaKid", status: "online" },
    { id: 5, name: "DragonMaster", status: "in-game" },
  ];
  return (
    <>
      <div className="h-full flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lime-400">Friends</h3>
          <Button size="sm" variant="ghost" className="hover:bg-lime-500/20">
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
                <span className="text-xs text-slate-500">{friend.status}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
