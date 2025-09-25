import User from "../models/user.model.js";
import Group from "../models/groups.model.js";

export const addFriend = async (req, res) => {
    try {
        const userId = req.user._id;
        const friendId = req.params.userId;

        if (userId.toString() === friendId) {
            return res.status(400).json({ message: "Không thể kết bạn với chính mình" });
        }

        const user = await User.findById(userId);
        const friend = await User.findById(friendId);

        if (!friend) return res.status(404).json({ message: "Người dùng không tồn tại" });

        if (user.friends.includes(friendId) || friend.friends.includes(userId)) {
            return res.status(400).json({ message: "Hai người đã là bạn bè" });
        }

        if (user.sentRequests.includes(friendId)) {
            return res.status(400).json({ message: "Đã gửi lời mời trước đó" });
        }

        if (user.friendRequests.includes(friendId)) {
            user.friends.push(friendId);
            friend.friends.push(userId);

            user.friendRequests = user.friendRequests.filter(
                (id) => id.toString() !== friendId.toString()
            );
            friend.sentRequests = friend.sentRequests.filter(
                (id) => id.toString() !== userId.toString()
            );

            await user.save();
            await friend.save();

            return res.status(200).json({ message: "Đã trở thành bạn bè" });
        }

        user.sentRequests.push(friendId);
        friend.friendRequests.push(userId);

        await user.save();
        await friend.save();

        res.status(200).json({ message: "Đã gửi lời mời kết bạn" });
    } catch (error) {
        console.log("Error in addFriend:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Chấp nhận lời mời kết bạn
export const acceptRequest = async (req, res) => {
    try {
        const userId = req.user._id;
        const requesterId = req.params.userId;

        const user = await User.findById(userId);
        const requester = await User.findById(requesterId);

        if (!requester) return res.status(404).json({ message: "Người gửi không tồn tại" });
        if (!user.friendRequests.includes(requesterId)) {
            return res.status(400).json({ message: "Không có lời mời từ user này" });
        }

        user.friends.push(requesterId);
        requester.friends.push(userId);

        user.friendRequests = user.friendRequests.filter(
            (id) => id.toString() !== requesterId.toString()
        );
        requester.sentRequests = requester.sentRequests.filter(
            (id) => id.toString() !== userId.toString()
        );

        await user.save();
        await requester.save();

        res.status(200).json({ message: "Đã chấp nhận kết bạn" });
    } catch (error) {
        console.log("Error in acceptRequest:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const denyRequest = async (req, res) => {
    try {
        const userId = req.user._id;
        const requesterId = req.params.userId;

        const user = await User.findById(userId);
        const requester = await User.findById(requesterId);

        if (!user.friendRequests.includes(requesterId)) {
            return res.status(400).json({ message: "Không có lời mời từ user này" });
        }

        user.friendRequests = user.friendRequests.filter(
            (id) => id.toString() !== requesterId.toString()
        );
        await user.save();

        if (requester) {
            requester.sentRequests = requester.sentRequests.filter(
                (id) => id.toString() !== userId.toString()
            );
            await requester.save();
        }

        res.status(200).json({ message: "Đã từ chối lời mời kết bạn" });
    } catch (error) {
        console.log("Error in denyRequest:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const deleteFriend = async (req, res) => {
    try {
        const userId = req.user._id;
        const friendId = req.params.userId;

        const user = await User.findById(userId);
        const friend = await User.findById(friendId);

        if (!friend) return res.status(404).json({ message: "Người dùng không tồn tại" });

        user.friends = user.friends.filter((id) => id.toString() !== friendId.toString());
        friend.friends = friend.friends.filter((id) => id.toString() !== userId.toString());

        await user.save();
        await friend.save();

        res.status(200).json({ message: "Đã xóa bạn bè" });
    } catch (error) {
        console.log("Error in deleteFriend:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Thêm user vào group
export const addUserToGroup = async (req, res) => {
    try {
        const { groupId, userId } = req.params;

        const group = await Group.findById(groupId);
        if (!group) return res.status(404).json({ message: "Nhóm không tồn tại" });

        if (!group.members.includes(userId)) {
            group.members.push(userId);
            await group.save();
        }

        res.status(200).json({ message: "Đã thêm user vào nhóm" });
    } catch (error) {
        console.log("Error in addUserToGroup:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
export const getFriendList = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId)
      .populate("friends", "fullName email profilePic");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user.friends);
  } catch (error) {
    console.error("Error in getFriendList:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Lấy danh sách lời mời kết bạn mình nhận
export const getPendingRequests = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId)
      .populate("friendRequests", "fullName email profilePic");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user.friendRequests);
  } catch (error) {
    console.error("Error in getPendingRequests:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Lấy danh sách lời mời kết bạn mình đã gửi
export const getSentRequests = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId)
      .populate("sentRequests", "fullName email profilePic");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user.sentRequests);
  } catch (error) {
    console.error("Error in getSentRequests:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};