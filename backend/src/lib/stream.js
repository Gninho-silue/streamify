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

export const createChannel = async (type, channelId, data) => {
    try {
        // Ensure created_by_id is included for server-side auth
        const channelData = {
            ...data,
            created_by_id: data.created_by_id || data.members?.[0] || 'system'
        };
        
        const channel = client.channel(type, channelId, channelData);
        await channel.create();
        return channel;
    } catch (error) {
        console.error("Error creating Stream channel:", error);
        throw error;
    }
}

export const addMembersToChannel = async (channelId, memberIds) => {
    try {
        const channel = client.channel('messaging', channelId);
        await channel.addMembers(memberIds);
        return channel;
    } catch (error) {
        console.error("Error adding members to Stream channel:", error);
        throw error;
    }
}

export async function removeMemberFromChannel(channelId, userId) {
    try {
        // Récupérer le canal
        const channel = client.channel('messaging', channelId);

        // Supprimer le membre du canal
        await channel.removeMembers([userId]);

        return true;
    } catch (error) {
        console.error('Error removing member from Stream channel:', error);
        throw error;
    }
}