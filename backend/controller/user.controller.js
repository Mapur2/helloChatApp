import User from "../models/User";

export async function getRecommendedUsers(req, res) {
    try {
        const currentUser = req.user
        const currentUserId = currentUser._id

        const recommendedUsers = await User.find({
            $and:[
                { _id: { $ne: currentUserId } },
                { _id: { $nin: currentUser.friends } },
                { isOnboarded: true }
            ]
        });
        res.status(200).json({success:true,recommendedUsers});
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function getMyFriends(req, res) {
    try {
        const currentUser = req.user
        const currentUserId = currentUser._id
        const user = await User.findById(currentUserId).select("friends")
        .populate("friends", "fullName","profilePic","nativeLanguage","learningLanguage");
        res.status(200).json({success:true,friends:user.friends});
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}


export async function sendFriendRequest(req, res) {
    try {
        
    } catch (error) {
        
    }
}