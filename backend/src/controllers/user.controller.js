const userModel = require('../models/user.model');
const friendRequestModel = require('../models/friendRequest.model');
const { upsertStreamUser } = require('../config/stream');


async function getRecommendedUsersController(req, res) {
    try {
        const currentUserId = req.user._id;
        const currentUser = req.user;

        const pendingRequests = await friendRequestModel.find({
            $or: [
                { sender: currentUserId },
                { recipient: currentUserId }
            ],
            status: "pending"
        });

        const pendingRequestSenders = pendingRequests.map((request) => {
            return request.sender;
        });

        const recommendedUsers = await userModel.find({
            $and: [
                { _id: { $ne: currentUserId } },
                { _id: { $nin: currentUser.friends } },
                { _id: { $nin: pendingRequestSenders } },
                { isOnboarded: true },
            ]
        }).select('-password');

        res.status(200).json(recommendedUsers);

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}


async function getFriendsController(req, res) {
    try {

        const user = await userModel.findById(req.user._id)
            .select('friends')
            .populate(
                'friends',
                'fullName profilePic nativeLanguage learningLanguage'
            );

        res.status(200).json(user.friends);

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}


async function sendFriendRequestsController(req, res) {
    try {
        const senderId = req.user._id;
        const recipientId = req.params.id;

        if (senderId.toString() === recipientId.toString()) {
            return res.status(400).json({
                message: "You cannot send a friend request to yourself"
            });
        }

        const recipient = await userModel.findById(recipientId);
        if (!recipient) {
            return res.status(404).json({
                message: "Recipient user not found"
            });
        }

        if (recipient.friends.includes(senderId)) {
            return res.status(400).json({
                message: "You are already friends with this user"
            });
        }

        const existingRequest = await friendRequestModel.findOne({
            $or: [
                { sender: senderId, recipient: recipientId },
                { sender: recipientId, recipient: senderId }
            ]
        });
        if (existingRequest) {
            return res.status(400).json({
                message: "Friend request already sent"
            });
        }

        const friendRequest = await friendRequestModel.create({
            sender: senderId,
            recipient: recipientId
        });

        res.status(201).json(friendRequest);
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}


async function acceptFriendRequestController(req, res) {
    try {
        const recipientId = req.user._id;
        const friendRequestId = req.params.id;

        const friendRequest = await friendRequestModel.findById(friendRequestId);

        if (!friendRequest) {
            return res.status(404).json({
                message: "Friend request not found"
            });
        }


        if (friendRequest.recipient.toString() !== recipientId.toString()) {
            return res.status(403).json({
                message: "You are not authorized to accept this friend request"
            });
        }

        if (friendRequest.status === "accepted") {
            return res.status(400).json({
                message: "Friend request already accepted"
            });
        }

        friendRequest.status = "accepted";
        await friendRequest.save();


        await userModel.findByIdAndUpdate(
            friendRequest.sender,
            {
                $addToSet:
                    { friends: friendRequest.recipient }
            }
        );

        await userModel.findByIdAndUpdate(
            friendRequest.recipient,
            {
                $addToSet:
                    { friends: friendRequest.sender }
            }
        );

        return res.status(200).json({
            message: "Friend request accepted successfully"
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}


async function getFriendRequestsController(req, res) {
    try {

        const incomingRequests = await friendRequestModel.find({
            recipient: req.user._id,
            status: "pending"
        }).populate(
            'sender',
            'fullName profilePic nativeLanguage learningLanguage'
        );

        const acceptedRequests = await friendRequestModel.find({
            sender: req.user._id,
            status: "accepted"
        }).populate(
            'recipient',
            'fullName profilePic'
        );

        return res.status(200).json({
            incomingRequests,
            acceptedRequests
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}


async function getOutgoingFriendRequestsController(req, res) {
    try {
        const outgoingRequests = await friendRequestModel.find({
            sender: req.user._id,
            status: "pending"
        }).populate(
            'recipient',
            'fullName profilePic nativeLanguage learningLanguage'
        );
        return res.status(200).json(outgoingRequests);

    } catch (err) {

        console.error(err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}


async function updateProfileController(req, res) {
    try {
        const userId = req.user._id;

        const {
            fullName,
            bio,
            nativeLanguage,
            learningLanguage,
            location,
            profilePic
        } = req.body;

        if (
            !fullName ||
            !bio ||
            !nativeLanguage ||
            !learningLanguage ||
            !location
        ) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            {
                fullName,
                bio,
                nativeLanguage,
                learningLanguage,
                location,
                profilePic
            },
            {
                new: true
            }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }


        await upsertStreamUser({
            id: updatedUser._id.toString(),
            name: updatedUser.fullName,
            image: updatedUser.profilePic || "",
        });

        return res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser
        });

    } catch (error) {
        console.error("Update Profile Error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

module.exports = {
    getRecommendedUsersController,
    getFriendsController,
    sendFriendRequestsController,
    acceptFriendRequestController,
    getFriendRequestsController,
    updateProfileController,
    getOutgoingFriendRequestsController
};