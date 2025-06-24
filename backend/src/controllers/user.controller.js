import User from "../models/User.js"; 
import FriendRequest from "../models/FriendRequest.js";
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
        console.log("Recommended users:", recommendedUsers.length);
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
        const user = await User.findById(userId).select("friends").populate("friends","fullName profilePic nativeLanguage learningLanguage"); // Fetch the user without password
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
export  async function sendFriendRequest(req, res) {
    try{
        const myId = req.user._id;
    const { id: recipientId } = req.params;

    // prevent sending req to yourself
    if (myId === recipientId) {
      return res.status(400).json({ message: "You can't send friend request to yourself" });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    // check if user is already friends
    if (recipient.friends.includes(myId)) {
      return res.status(400).json({ message: "You are already friends with this user" });
    }

    // check if a req already exists
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: myId, recipient: recipientId },
        { sender: recipientId, recipient: myId },
      ],
    });

    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "A friend request already exists between you and this user" });
    }

    const friendRequest = await FriendRequest.create({
      sender: myId,
      recipient: recipientId,
    });
    return res.status(201).json({
      message: "Friend request sent successfully",
      success: true,
      friendRequest,})
    }
    catch{
        console.log("Error in sending friend request:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
export async function acceptFriendRequest(req, res) {
    try {
        const { id: requestId } = req.params;
        const { decision } = req.body; // 'accept' or 'reject'
        const myId = req.user._id;

        const friendRequest = await FriendRequest.findById(requestId);
        if (!friendRequest) {
            return res.status(404).json({ message: "Friend request not found" });
        }

        if (friendRequest.recipient.toString() !== myId.toString()) {//this is checking ki recipient id tumhara he hai na agar nhi mtlb koi aur sender hai
            return res.status(403).json({ message: "You are not authorized to respond to this friend request" });
        }

        if (decision === "accept") {
            friendRequest.status = "accepted";
            await friendRequest.save();

            // Add each user to the other's friends list
            await User.findByIdAndUpdate(myId, {
                $addToSet: { friends: friendRequest.sender }
            });
            await User.findByIdAndUpdate(friendRequest.sender, {
                $addToSet: { friends: myId }
            });

            return res.status(200).json({ message: "Friend request accepted" });
        } 
        else if (decision === "reject") {
            friendRequest.status = "rejected";
            await friendRequest.save();

            return res.status(200).json({ message: "Friend request rejected" });
        } 
        else {
            return res.status(400).json({ message: "Invalid decision" });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error while responding to friend request" });
    }
}
//this funnction now will be used to see the pedning friend requests to me 
//as well as in this status of other friend request will al trso be shown here 
export async function getFriendRequests(req, res) {
    try {
        //jitni bhi friend request tumhe aayi hai unhe fetch karlo
        const incomingReq=await FriendRequest.find({
            recipient: req.user._id,
            status: "pending"
        }).populate("sender", "fullName profilePic nativeLanguage learningLanguage");
        //now i need to see the status of all the requests which i have sent 
        const acceptedReq = await FriendRequest.find({
            sender: req.user._id,
            status: "accepted"
        }).populate("recipient", "fullName profilePic");

        const rejectedReq = await FriendRequest.find({
            sender: req.user._id,
            status: "rejected"
        }).populate("recipient", "fullName profilePic");
        return res.status(200).json({
            message: "Friend requests fetched successfully",
            success: true,
            incomingRequests: incomingReq,
            acceptedRequests: acceptedReq,
            rejectedRequests: rejectedReq
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error while fetching friend requests" });
    }
}
export async function getOutgoingFriendReqs(req, res) {
    try {
      const outgoingRequests = await FriendRequest.find({
        sender: req.user._id,
        status: "pending",
      }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage");
      
      res.status(200).json({
        message: "Outgoing friend requests fetched successfully",
        success: true,
        outgoingRequests,
      });
    } catch (error) {
      console.log("Error in getOutgoingFriendReqs controller", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }