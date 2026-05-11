// Lưu tin nhắn chat tổng
import mongoose from "mongoose";

const generalChatSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    content: {
      type: String,
      trim: true,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Sắp xếp và tự xóa sau 1h = 3600s
generalChatSchema.index({ createdAt: -1 }, { expireAfterSeconds: 3600 });

const GeneralChat = mongoose.model("GeneralChat", generalChatSchema);

export default GeneralChat;
