import express from "express";
import { connectDB } from "./config/database.js";

//Cấu hình đọc file env
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use("/", (req, res) => {
  res.send("hello world");
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`==>> Server bắt đầu trên cổng ${PORT}!\n`);
  });
});
