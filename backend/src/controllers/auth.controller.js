import { upsertStreamUser } from "../lib/stream.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export async function signup(req, res) {
  // Handle user signup logic here
  const {  fullName,email,password } = req.body;
    try {
        
        //console.log("Received signup request:", { email, password, fullName });
        if (!email || !password || !fullName) {
            return res.status(400).json({ message: "All fields are required" });
          }
      
          if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
          }
      
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
          if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
          }
      
          const existingUser = await User.findOne({ email });
          if (existingUser) {
            return res.status(400).json({ message: "Email already exists, please use a diffrent one" });
          }
      
          const idx = Math.floor(Math.random() * 100) + 1; // generate a num between 1-100
          const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
      
          const newUser = await User.create({
            email,
            fullName,
            password,
            profilePic: randomAvatar,
          });
          //create the user in the stream as wekk so that it can chat or video call from our third party application which is providing us the service
          try {
            await upsertStreamUser({
              id:newUser._id.toString(), // Stream requires the user ID to be a string
              name: newUser.fullName,
              image: newUser.profilePic || " "
            })
           console.log("Stream user created usccusfully")  
          } catch (error) {
            console.log("Error creating Stream user:", error);
          }
          //after this this will save the user to the stream as well so that we can use the stream services like chat and video call

          //create the jwt token so after succusfully connection user gets the token
            const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });
            //put this token in cookies of client 
            res.cookie("jwt", token, {
                httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
                sameSite: 'Strict', // Helps prevent CSRF attacks
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
                secure:false // Use secure cookies in production
            })
            res.status(201).json({
                message: "User created  successfully",
                success: true,
                user: newUser
            })
    } catch (error) {
        console.log("Errorin signing up user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
export async function signin(req, res) {
    // Handle user signup logic here
    //for signin email and password is required 
    const {email,password}=req.body
    try {
        if(!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const user=await User.findOne({email})
        if(!user) {
            return res.status(400).json({ message: "Email does not exist please signup" });
        }
        const isPasswordCorrect = await user.matchPassword(password);
        if(!isPasswordCorrect) {
            return res.status(400).json({ message: "Incorrect password" });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "7d",
          });
      
          res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true, // prevent XSS attacks,
            sameSite: "strict", // prevent CSRF attacks
            secure: false,
          });
      
          res.status(200).json({ success: true, user });

    } catch (error) {
        console.log("Error in login user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
  }
  export function logout(req, res) {
    // Handle user signup logic here
   
    res.clearCookie("jwt"); // Clear the cookie
    res.status(200).json({ message: "User logged out successfully" });
  }

  export async function onboard(req, res) {
    //in borading we will update the user profile and bio
    try {
      const userId=req.user._id; // Get the user ID from the request object
      //console.log("Onboarding user with ID:", userId);
      const user= await User.findById(userId);
      if(!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { fullName, bio,nativeLanguage,learningLanguage,location } = req.body;
      if (!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
        return res.status(400).json({ message: "All fields are required" });
      }
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          ...req.body,
          isOnboarded: true, // Set isOnboarded to true
        },
        { new: true } // Return the updated user
      );

      //update the user in stream as well
      try {
        await upsertStreamUser({
          id: updatedUser._id.toString(), // Stream requires the user ID to be a string
          name: updatedUser.fullName,
          image: updatedUser.profilePic || " "
        });
        console.log("user updated in stream")   
      } catch (error) {
        console.log("Error updating Stream user:", error);
      }
      if(!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({
        message: "User onboarded successfully",
        success: true,
        user: updatedUser,
      });

    } catch (error) {
      console.log("onboarding errror:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }