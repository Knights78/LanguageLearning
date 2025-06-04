//this is used when after going on the boarding page to changep profile or bio then we will check whether the user is authenticated or or 
//with the token stored in the cookie
import User from "../models/User.js";
import jwt from "jsonwebtoken"; // Import the jsonwebtoken library
export const protectedRoute =async (req, res, next) => {
  const token = req.cookies.jwt; // Get the JWT from cookies
  //console.log("TOKEN",token)
  if (!token) {
    return res.status(401).json({ message: "Unauthorized access token is not there" });
  }


  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // Verify the token
   if(!decoded) {
      return res.status(401).json({ message: "Unauthorized access token is not valid" });
   }
   const user=await User.findById(decoded.userId).select("-password"); // Find the user by ID from the token i have used payload as userId that is why i can access it
   if(!user) {
      return res.status(401).json({ message: "Unauthorized access user not found" });
   }
   req.user = user; // Attach the user to the request object
   next(); // Call the next middleware or route handler
  } catch (error) { 
    console.error("Token verification failed:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
}