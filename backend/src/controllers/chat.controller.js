import { generateStreamToken } from "../lib/stream.js";
export async function getStreamToken(req,res){
    try {
        const token = await generateStreamToken(req.user._id);
        return res.status(200).json({
             token
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error generating Stream token",
            success: false,
            error: error.message,
        });
    }
}