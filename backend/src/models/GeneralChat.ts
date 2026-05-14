// Lưu tin nhắn chat tổng
import mongoose from "mongoose";

// tính theo s(giây)
const MESSAGE_TTL = 7 * 24 * 60 * 60;

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
      maxlength: [500, "Tin nhắn không được vượt quá 500 ký tự"],
    },
  },
  {
    timestamps: true,
  },
);

// Sắp xếp và tự xóa
generalChatSchema.index({ createdAt: -1 }, { expireAfterSeconds: MESSAGE_TTL });

const GeneralChat = mongoose.model("GeneralChat", generalChatSchema);

export default GeneralChat;
