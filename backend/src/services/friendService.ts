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

  return request;
};

export const createFriendship = async (requestId: any, userId: string) => {
  // Kiểm tra xem lời mời có tồn tại không
  const request = await FriendRequest.findById(requestId);
  if (!request) {
    throw new Error("Lỗi! Không tìm thấy lời mời kết bạn!");
  }

  // Kiểm tra xem đúng người được mời không
  if (request.to.toString() !== userId.toString()) {
    throw new Error("Lỗi! Bạn không có quyền chấp nhận lời mời này!");
  }

  // Tạo quan hệ bạn bè
  const friend = await Friend.create({
    userA: request.from,
    userB: request.to,
  });

  // Xóa yêu cầu đã chấp nhận
  await FriendRequest.findByIdAndDelete(requestId);

  // Trả về thông tin bạn bè mới chấp nhận
  const from = await User.findById(request.from)
    .select("_id displayName")
    .lean(); // lean giúp trả về json thay vì document => tối ưu hơn

  return {
    _id: from?._id,
    displayName: from?.displayName,
  };
};

export const deleteFriendRequest = async (requestId: any, userId: string) => {
  const request = await FriendRequest.findById(requestId);
  if (!request) {
    throw new Error("Lỗi! Không tìm thấy lời mời kết bạn!");
  }

  if (request.to.toString() !== userId.toString()) {
    throw new Error("Lỗi! Bạn không có quyền từ chối lời mời này!");
  }

  await FriendRequest.findByIdAndDelete(requestId);
};

export const deleteFriendship = async (friendshipId: any, userId: string) => {
  const deleteFriend = await Friend.findOneAndDelete({
    _id: friendshipId,
    $or: [{ userA: userId }, { userB: userId }],
  });
  if (!deleteFriend) {
    throw new Error(
      "Lỗi! Không có dữ liệu bạn bè hoặc bạn không có quyền xóa!",
    );
  }
};

export const fetchUserFriends = async (userId: string) => {
  const friendships = await Friend.find({
    $or: [{ userA: userId }, { userB: userId }],
  })
    .populate("userA", "_id displayName username")
    .populate("userB", "_id displayName username")
    .lean();

  if (!friendships.length) {
    return [];
  }

  const friends = friendships.map((f) => {
    const friendInfo =
      f.userA._id.toString() === userId.toString() ? f.userB : f.userA;
    return {
      ...friendInfo,
      friendshipId: f._id,
    };
  });

  return friends;
};

export const fetchFriendRequests = async (userId: string) => {
  const populateFiels = "_id username displayName";

  const [sent, received] = await Promise.all([
    FriendRequest.find({ from: userId }).populate("to", populateFiels),
    FriendRequest.find({ to: userId }).populate("from", populateFiels),
  ]);

  return [sent, received];
};
