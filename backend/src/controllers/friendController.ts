import type { Response } from "express";
import type { CustomRequest } from "../models/CustomRequest.js";
import {
  createFriendRequest,
  createFriendship,
  deleteFriendRequest,
} from "../services/friendService.js";

export const sendFriendRequest = async (req: CustomRequest, res: Response) => {
  try {
    const { to, message } = req.body;
    const from = req.user._id;
    const request = await createFriendRequest(from, to, message);

    return res
      .status(201)
      .json({ message: "Gửi lời mời kết bạn thành công!", request });
  } catch (error: any) {
    if (
      error.message === "Lỗi tự gửi yêu cầu kết bạn cho chính mình!" ||
      error.message === "Lỗi! Hai người đã là bạn bè!" ||
      error.message === "Lỗi! Đã có lời mời kết bạn đang chờ!"
    ) {
      console.error(error.message);
      return res.status(400).json({
        message: error.message,
      });
    }
    if (error.message === "Lỗi! Người dùng không tồn tại!") {
      console.error(error.message);
      return res.status(404).json({ message: error.message });
    }
    console.error("Lỗi khi gửi yêu cầu kết bạn!", error);
    return res.status(500).json({ message: "Lỗi hệ thống!" });
  }
};

export const acceptFriendRequest = async (
  req: CustomRequest,
  res: Response,
) => {
  try {
    const { requestId } = req.params;
    const userId = req.user._id; // Đây là id của người đang đăng nhập

    const newFriend = await createFriendship(requestId, userId);
    return res.status(200).json({
      message: "Chấp nhận lời mời kết bạn thành công",
      newFriend,
    });
  } catch (error: any) {
    if (error.message === "Lỗi! Không tìm thấy lời mời kết bạn!") {
      return res.status(404).json({ message: error.message });
    }
    if (error.message === "Lỗi! Bạn không có quyền chấp nhận lời mời này!") {
      return res.status(403).json({ message: error.message });
    }
    console.error("Lỗi khi chấp nhận lời mời kết bạn!", error);
    return res.status(500).json({ message: "Lỗi hệ thống!" });
  }
};

export const declineFriendRequest = async (
  req: CustomRequest,
  res: Response,
) => {
  try {
    const { requestId } = req.params;
    const userId = req.user._id;

    await deleteFriendRequest(requestId, userId);
    return res.status(204).json({
      message: "Từ chối lời mời kết bạn thành công",
    });
  } catch (error: any) {
    if (error.message === "Lỗi! Không tìm thấy lời mời kết bạn!") {
      return res.status(404).json({ message: error.message });
    }
    if (error.message === "Lỗi! Bạn không có quyền từ chối lời mời này!") {
      return res.status(403).json({ message: error.message });
    }
    console.error("Lỗi khi từ chối lời mời kết bạn!", error);
    return res.status(500).json({ message: "Lỗi hệ thống!" });
  }
};

export const unfriend = async (req: CustomRequest, res: Response) => {
  try {
  } catch (error) {
    console.error("Lỗi khi hủy kết bạn!", error);
    return res.status(500).json({ message: "Lỗi hệ thống!" });
  }
};

export const getAllFriends = async (req: CustomRequest, res: Response) => {
  try {
  } catch (error) {
    console.error("Lỗi khi lấy danh sách bạn bè!", error);
    return res.status(500).json({ message: "Lỗi hệ thống!" });
  }
};

export const getFriendRequests = async (req: CustomRequest, res: Response) => {
  try {
  } catch (error) {
    console.error("Lỗi khi lấy danh sách yêu cầu kết bạn!", error);
    return res.status(500).json({ message: "Lỗi hệ thống!" });
  }
};
