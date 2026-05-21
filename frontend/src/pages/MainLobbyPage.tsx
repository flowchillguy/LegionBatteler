import { Card } from "@/components/ui.figma/card";
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
          <Card>
            <TopCenter />
          </Card>

          {/* Top Right - Leaderboard Button & Settings */}
          <Card>
            <TopRight />
          </Card>

          {/* Left Middle - Friends List */}
          <Card>
            <MiddleLeft />
          </Card>

          {/* Center - Game Canvas Area */}
          <Card>
            <MiddleCenter />
          </Card>

          {/* Right Middle - Unit Shop */}
          <Card>
            <MiddleRight />
          </Card>

          {/* Bottom Left - Global Chat */}
          <Card>
            <BottomLeft />
          </Card>

          {/* Bottom Center - Campaign & PVE Buttons */}
          <Card>
            <BottomCenter />
          </Card>

          {/* Bottom Right - Rank (Matchmaking) Button */}
          <Card>
            <BottomRight />
          </Card>
        </div>
      </div>

      <div><MainLobby/></div>
    </>
  );
};

export default MainLobbyPage;
