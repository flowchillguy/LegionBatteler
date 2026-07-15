import { useEffect, useRef } from "react";
import Phaser from "phaser";
import { MainScene } from "@/game/scenes/MainScene";

interface GameWrapperProps {
  roomId: string; // Nhận roomId từ GamePage truyền vào
}

export default function GameWrapper({ roomId }: GameWrapperProps) {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const gameInstanceRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (gameInstanceRef.current || !gameContainerRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      scale: {
        mode: Phaser.Scale.RESIZE,
        width: "100%",
        height: "100%",
      },
      parent: gameContainerRef.current,
      backgroundColor: "#2d2d2d",
      scene: [MainScene], // Gọi Scene đã tạo ở Bước 1 vào đây
    };

    gameInstanceRef.current = new Phaser.Game(config);

    return () => {
      if (gameInstanceRef.current) {
        gameInstanceRef.current.destroy(true);
        gameInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={gameContainerRef}
      id="phaser-container"
      className="absolute inset-0 z-0"
    />
  );
}
