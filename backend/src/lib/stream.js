import "dotenv/config";
import {StreamChat} from "stream-chat";

const apiKey = process.env.STEAM_API_KEY;
const apiSecret = process.env.STEAM_API_SECRET;
if(!apiKey || !apiSecret)
{
    console.error("Missing API key or secret. Please set STEAM_API_KEY and STEAM_API_SECRET in your environment variables.");
    process.exit(1);
}
//You must create users in Stream's system before they can join channels or send messages — this function handles that setup.
// upsertUsers():

// Stands for "update or insert".

// If the user already exists, it updates the profile (name/image).

// If the user doesn’t exist, it creates a new user in the Stream system.


const streamClient = StreamChat.getInstance(apiKey, apiSecret);//by this client we can communicate with the stream application
export const upsertStreamUser=async(userData)=>{
    try {
        await streamClient.upsertUsers([userData])
        return userData
    } catch (error) {
        console.error("Error upserting user in Stream:", error);
    }
}
export const generateStreamToken=async(userId)=>{
    try {
        //generate the toekn using streamClient 
        const userIdstr=userId.toString();
        const token = streamClient.createToken(userIdstr);
        return token;
    } catch (error) {
        return res.status(500).json({
            message: "Error generating Stream token",
            success: false,
            error: error.message,
        });
    }
}


