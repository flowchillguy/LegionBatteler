import { getCloudinaryUrl } from "@/lib/cloudinary";
import Phaser from "phaser";

export class MainScene extends Phaser.Scene {
  private bg!: Phaser.GameObjects.Image;

  constructor() {
    super({ key: "MainScene" }); // Tên định danh của Scene này
  }

  preload() {
    const bgUrl = getCloudinaryUrl("bg_ykgngk");

    this.load.image("background", bgUrl);
  }

  create() {
    const { width, height } = this.scale;
    this.bg = this.add.image(width / 2, height / 2, "background");
    this.bg.setDepth(0);
    this.updateBackgroundSize(width, height);
    this.scale.on("resize", (gameSize: Phaser.Structs.Size) => {
      const newWidth = gameSize.width;
      const newHeight = gameSize.height;

      // Đưa ảnh ra lại chính giữa
      this.bg.setPosition(newWidth / 2, newHeight / 2);
      // Tính lại tỷ lệ phóng to/thu nhỏ
      this.updateBackgroundSize(newWidth, newHeight);
    });
  }

  update() {
    //Logic game chạy 60 lần/giây nằm ở đây
  }

  private updateBackgroundSize(canvasWidth: number, canvasHeight: number) {
    // Lấy kích thước gốc của bức ảnh
    const imgWidth = this.bg.width;
    const imgHeight = this.bg.height;

    // Tính tỷ lệ cần phóng to cho chiều ngang và chiều dọc
    const scaleX = canvasWidth / imgWidth;
    const scaleY = canvasHeight / imgHeight;

    // Lấy tỷ lệ LỚN HƠN (Math.max) để đảm bảo ảnh luôn che kín các khoảng đen
    // Nếu muốn ảnh hiện đầy đủ không bị cắt (nhưng hở viền đen), dùng Math.min
    const scale = Math.max(scaleX, scaleY);

    this.bg.setScale(scale);
  }
}
