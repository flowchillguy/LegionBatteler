import { Card } from "@/components/ui/card";
import TopLeft from "@/components/lobby/topLeft";
import TopCenter from "@/components/lobby/topCenter";
import TopRight from "@/components/lobby/topRight";
import MiddleLeft from "@/components/lobby/middleLeft";
import MiddleCenter from "@/components/lobby/middleCenter";
import MiddleRight from "@/components/lobby/middleRight";
import BottomLeft from "@/components/lobby/bottomLeft";
import BottomCenter from "@/components/lobby/bottomCenter";
import BottomRight from "@/components/lobby/bottomRight";
import MainLobby from "@/components/lobby/mainLobby.tsx"

const MainLobbyPage = () => {
  return (
    <>
      <div className="game-wrapper">
        <div className="h-screen grid grid-cols-12 grid-rows-12 gap-4">
          {/* Top Left - User Profile */}
          <Card className="col-span-3 row-span-2 game-panel">
            <TopLeft />
          </Card>

          {/* Top Center - Resources & Mini Chat */}
          <Card className="col-span-6 row-span-2 game-panel">
            <TopCenter />
          </Card>

          {/* Top Right - Leaderboard Button & Settings */}
          <Card className="col-span-3 row-span-2 game-panel">
            <TopRight />
          </Card>

          {/* Left Middle - Friends List */}
          <Card className="col-span-3 row-span-6 game-panel">
            <MiddleLeft />
          </Card>

          {/* Center - Game Canvas Area */}
          <div className="col-span-6 row-span-6">
            <MiddleCenter />
          </div>

          {/* Right Middle - Unit Shop */}
          <Card className="col-span-3 row-span-6 game-panel">
            <MiddleRight />
          </Card>

          {/* Bottom Left - Global Chat */}
          <Card className="col-span-3 row-span-4 game-panel">
            <BottomLeft />
          </Card>

          {/* Bottom Center - Campaign & PVE Buttons */}
          <div className="col-span-6 row-span-4">
            <BottomCenter />
          </div>

          {/* Bottom Right - Rank (Matchmaking) Button */}
          <Card className="col-span-3 row-span-4 game-panel">
            <BottomRight />
          </Card>
        </div>
        <footer>© Legion Batteler - Dang Dinh Hoang - 2026</footer>
      </div>

      <div><MainLobby/></div>
    </>
  );
};

export default MainLobbyPage;
