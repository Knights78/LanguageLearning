import User from "../models/User.js"; 
export async function getRecommendedUsers(req, res) {
    try {
        //after this fetch the data from the database
        const userId = req.user._id; // Get the user ID from the request object
        const user= await User.findById(userId).select("-password"); // Fetch the user without password
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        //while finding the recommended user i dont want myself to appear and my friends 
        const recommendedUsers = await User.find({
            $and: [
                { _id: { $ne: userId } }, // Exclude the current user
                { isOnboarded: true }, // Only include users who have completed onboarding
                { _id: { $nin: user.friends } } // Exclude friends of the current user
            ]
        }).select("-password"); // Exclude password from the results
        res.status(200).json({
            message: "Recommended users fetched successfully",
            success: true,
            recommendedUsers
        });



    } catch (error) {
        console.log("Error in get recommended users:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
export async function getMyFriends(req, res) {
    try {
        //after this fetch the data from the database 
        const userId = req.user._id; // Get the user ID from the request object
        const user = await User.findById(userId).select("friends").populate("friends","fullName profilePic nativeLanguage learningLanguage",); // Fetch the user without password
        //after getting the user fetch the friends array of the user 
        res.status(200).json({
            message: "Friends fetched successfully",
            success: true,
            friends: user.friends // Return the friends array
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
    }
    catch (error) {
        console.log("Error in get my friends:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}