import {StreamChat} from 'stream-chat'
import 'dotenv/config'

const apiKey = process.env.STREAM_API_KEY
const apiSecret = process.env.STREAM_API_SECRET

if (!apiKey || !apiSecret) {
    throw new Error("Missing Stream API credentials")
}

const client = StreamChat.getInstance(apiKey, apiSecret)

export const createStreamUser = async (userData) => {
    try {
        await client.upsertUsers([userData])
        return userData
    } catch (error) {
        console.error("Error creating Stream user:", error)
    }
}

export const generateStreamToken = (userId) => {
    try {
        const userIdStr = userId.toString()
        return client.createToken(userIdStr)
    } catch (error) {
        console.error("Error generating Stream token:", error)
    }
}
