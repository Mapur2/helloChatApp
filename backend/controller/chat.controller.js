import { generateStreamToken } from "../lib/stream.js";

export async function getStreamToken(req, res) {
  try {
    const userId = req.user._id;
    const token = await generateStreamToken(userId);
    res.status(200).json({ success: true, token });
  } catch (error) {
    console.error("Error in getStreamToken controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}