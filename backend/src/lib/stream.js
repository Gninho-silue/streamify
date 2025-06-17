import {StreamChat } from 'stream-chat';
import "dotenv/config";

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
    console.log("STREAM_API_KEY and STREAM_API_SECRET must be set in environment variables.");
    process.exit(1);
}

const client = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {
    try {
        await client.upsertUsers([userData]);
        return userData;
    } catch (error) {
        console.error("Error upserting Stream user:", error);
    }
}

export const generateStreamToken = (userId) => {
    try {
        const token = client.createToken(userId.toString());
        return token;
    } catch (error) {
        console.error("Error generating Stream token:", error);
    }
}