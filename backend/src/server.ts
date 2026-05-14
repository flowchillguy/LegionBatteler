import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/database.js";
import cors from "cors";
import apiRoutes from "./routes/allRoutes.js";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import fs from "fs";

//Cấu hình đọc file env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================================
// Cài đặt các Middleware toàn cục
// ============================================================

// Bộ giải mã dữ liệu (Parser)
// Cho phép Server của bạn đọc được dữ liệu gửi lên dưới định dạng JSON từ phía Frontend (thông qua body của request)
app.use(express.json());

// Bộ lá chắn bảo mật và cấp phép giao tiếp giữa các nguồn khác nhau
// Credentials: true: Cho phép trình duyệt gửi kèm các thông tin xác thực như Cookies hoặc headers Authorization khi thực hiện yêu cầu
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// Giúp Server có thể "đọc" và hiểu được các đoạn Cookies mà trình duyệt gửi kèm theo mỗi request
app.use(cookieParser());

// swagger
const swaggerDocument = JSON.parse(
  fs.readFileSync("./srs/swagger.json", "utf-8"),
);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api", apiRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`==>> Server bắt đầu trên cổng ${PORT}!\n`);
  });
});
