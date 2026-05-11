import FriendRequest from "../models/FriendRequest.js";
import Friend from "../models/Friend.js";
import User from "../models/User.js";

export const createFriendRequest = async (
  from: string,
  to: string,
  message: string,
) => {
  if (from === to) {
    throw new Error("Lỗi tự gửi yêu cầu kết bạn cho chính mình!");
  }

  const userExists = await User.exists({ _id: to });

  if (!userExists) {
    throw new Error("Lỗi! Người dùng không tồn tại!");
  }

  let userA = from.toString();
  let userB = to.toString();

  if (userA > userB) {
    [userA, userB] = [userB, userA];
  }

  // Gửi 2 yêu cầu cùng lúc lên db
  const [alreadyFriends, existingRequest] = await Promise.all([
    // Kiểm tra đã là bạn bè chưa
    Friend.findOne({ userA, userB }),

    // Kiểm tra 1 trong 2 đã gửi lời mời chưa
    FriendRequest.findOne({
      // Tìm theo hai hướng
      $or: [
        // Đã từng gửi lời mời nhưng chưa đồng ý
        { from, to },
        // Đã được đối phương mời kết bạn
        { from: to, to: from },
      ],
    }),
  ]);

  if (alreadyFriends) {
    throw Error("Lỗi! Hai người đã là bạn bè!");
  }

  if (existingRequest) {
    throw Error("Lỗi! Đã có lời mời kết bạn đang chờ!");
  }

  // Tạo lời mời khi mọi thứ đều ổn
  const request = await FriendRequest.create({
    from,
    to,
    message,
  });

  return request
};
export const createFriendship = () => {};
export const deleteFriendRequest = () => {};
export const deleteFriendship = () => {};
export const fetchUserFriends = () => {};
export const fetchFriendRequests = () => {};
