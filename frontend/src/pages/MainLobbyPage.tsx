import TopLeft from "@/components/lobby/topLeft";
import TopCenter from "@/components/lobby/topCenter";
import TopRight from "@/components/lobby/topRight";
import MiddleLeft from "@/components/lobby/middleLeft";
import MiddleCenter from "@/components/lobby/middleCenter";
import MiddleRight from "@/components/lobby/middleRight";
import BottomLeft from "@/components/lobby/bottomLeft";
import BottomCenter from "@/components/lobby/bottomCenter";
import BottomRight from "@/components/lobby/bottomRight";

const MainLobbyPage = () => {
  return (
    <>
      <div className="game-wrapper">
        <div className="h-screen grid grid-cols-12 grid-rows-12 gap-4">
          {/* Top Left - User Profile */}
          <TopLeft />

          {/* Top Center - Resources & Mini Chat */}
          <TopCenter />

          {/* Top Right - Leaderboard Button & Settings */}
          <TopRight />

          {/* Left Middle - Friends List */}
          <MiddleLeft />

          {/* Center - Game Canvas Area */}
          <MiddleCenter />

          {/* Right Middle - Unit Shop */}
          <MiddleRight />

          {/* Bottom Left - Global Chat */}
          <BottomLeft />

          {/* Bottom Center - Campaign & PVE Buttons */}
          <BottomCenter />

          {/* Bottom Right - Rank (Matchmaking) Button */}
          <BottomRight />
        </div>
      </div>
    </>
  );
};

export default MainLobbyPage;
