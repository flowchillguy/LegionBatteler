import { Card } from "@/components/ui/card";
import TopLeft from "@/components/lobby/topLeft";
import TopCenter from "@/components/lobby/topCenter";
import TopRight from "@/components/lobby/topRight";
import MiddleLeft from "@/components/lobby/middleLeft";
import MiddleCenter from "@/components/lobby/middleCenter";
import GlobalChat from "@/components/lobby/globalChat";
import BottomCenter from "@/components/lobby/bottomCenter";
import InfoUserForm from "@/components/lobby/infoUserForm";
import { useLobbyStore } from "@/stores/useLobbyStore";

const MainLobbyPage = () => {
  const { isInfoUserFormOpen, setIsInfoUserFormOpen } = useLobbyStore();

  return (
    <>
      <div className="h-screen game-wrapper">
        <div className="h-full grid grid-cols-12 grid-rows-12 gap-4">
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
          <Card className="col-span-3 row-span-9 game-panel">
            <MiddleLeft />
          </Card>

          {/* Center - Game Canvas Area */}
          <div className="col-span-6 row-span-2">
            <MiddleCenter />
          </div>

          {/* Right Middle - Chat general */}
          <Card className="col-span-3 row-span-9 game-panel">
            <GlobalChat />
          </Card>

          {/* Campaign & PVE Buttons */}
          <div className="col-span-6 row-span-7">
            <BottomCenter />
          </div>

          <footer className="col-span-12 row-span-1">
            © Legion Batteler - Dang Dinh Hoang - 2026
          </footer>
        </div>

        {isInfoUserFormOpen && (
          <div className="overlay-style" onClick={setIsInfoUserFormOpen}>
            {/* Form thông tin người dùng */}
            <InfoUserForm />
          </div>
        )}
      </div>
    </>
  );
};

export default MainLobbyPage;
