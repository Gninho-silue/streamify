import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";
import Notification from "../models/notification.model.js";
import { upsertStreamUser } from "../lib/stream.js";
import { sendFriendRequestNotification, sendFriendRequestAcceptedNotification } from '../utils/notificationUtils.js';

export async function getRecommendedUsers(req, res) {
  try {
    const currentUserId = req.user.id;
    const currentUser = req.user;

    console.log("Current user:", currentUser);
    console.log("Current user ID:", currentUserId);

    const recommendedUsers = await User.find({
      $and: [
        { _id: { $ne: currentUserId } }, //exclude current user
        { _id: { $nin: currentUser.friends } }, // exclude current user's friends
        { _id: { $nin: currentUser.blockedUsers } }, // exclude blocked users
        { blockedUsers: { $ne: currentUserId } }, // exclude users who blocked us
        { isOnBoarded: true },
      ],
    }).select('fullName profilePicture bio nativeLanguage learningLanguage location interests status availability');

    console.log("Recommended users found:", recommendedUsers.length);
    console.log("Recommended users:", recommendedUsers);

    res.status(200).json(recommendedUsers);
  } catch (error) {
    console.error("Error in getRecommendedUsers controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getMyFriends(req, res) {
    try {
        const user = await User.findById(req.user.id)
            .select("friends blockedUsers")
            .populate("friends", "fullName profilePicture bio nativeLanguage learningLanguage location interests status availability");

        // Filtrer les amis pour exclure les utilisateurs bloqués
        const filteredFriends = user.friends.filter(friend => 
            !user.blockedUsers.includes(friend._id) && 
            !friend.blockedUsers?.includes(user._id)
        );

        res.status(200).json(filteredFriends);
    } catch (error) {
        console.error("Error fetching friends:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function sendFriendRequest(req, res) {
    try {
        const currentUserId = req.user.id;
        const { userId: targetUserId } = req.params;

        //prevent sending friend request to self
        if (currentUserId === targetUserId) {
            return res.status(400).json({ message: "You cannot send a friend request to yourself." });
        }

        const targetUser = await User.findById(targetUserId);
        if (!targetUser) {
            return res.status(404).json({ message: "Recipient not found." });
        }

        // Vérifier si l'utilisateur est bloqué ou nous a bloqué
        const currentUser = await User.findById(currentUserId);
        if (currentUser.blockedUsers.includes(targetUserId) || targetUser.blockedUsers.includes(currentUserId)) {
            return res.status(403).json({ message: "Cannot send friend request to this user." });
        }

        // Check if the recipient is already a friend
        if (targetUser.friends.includes(currentUserId)) {
            return res.status(400).json({ message: "You are already friends with this user." });
        }

        // Check if a friend request already exists
        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: currentUserId, recipient: targetUserId },
                { sender: targetUserId, recipient: currentUserId }
            ]
        });
        if (existingRequest) {
            return res.status(400).json({ message: "Friend request already exists." });
        }

        const friendRequest = await FriendRequest.create({
            sender: currentUserId,
            recipient: targetUserId
        });

        // Créer une notification pour le destinataire
        await sendFriendRequestNotification(currentUser, targetUser);
        
        res.status(201).json({ friendRequest });
    } catch (error) {
        console.error("Error sending friend request:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function acceptFriendRequest(req, res) {
    try {
        const { requestId } = req.params;
        const friendRequest = await FriendRequest.findById(requestId);
        if (!friendRequest) {
            return res.status(404).json({ message: "Friend request not found." });   
        }

        //check if the current user is the recipient of the friend request
        if (friendRequest.recipient.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to accept this friend request." });
        }

        // Vérifier si l'un des utilisateurs a bloqué l'autre
        const sender = await User.findById(friendRequest.sender);
        const recipient = await User.findById(friendRequest.recipient);
        
        if (sender.blockedUsers.includes(recipient._id) || recipient.blockedUsers.includes(sender._id)) {
            return res.status(403).json({ message: "Cannot accept friend request from blocked user." });
        }

        friendRequest.status = "accepted";
        await friendRequest.save();

        // Add each user to the other's friends list
        await User.findByIdAndUpdate(friendRequest.sender, {
            $addToSet: { friends: friendRequest.recipient }
        });

        await User.findByIdAndUpdate(friendRequest.recipient, {
            $addToSet: { friends: friendRequest.sender }
        });

        // Créer une notification pour l'expéditeur
        await sendFriendRequestAcceptedNotification(recipient, sender);

        // Mettre à jour les utilisateurs dans Stream
        try {
            await upsertStreamUser({
                id: sender._id.toString(),
                name: sender.fullName,
                image: sender.profilePicture || "",
                status: sender.status,
                availability: sender.availability
            });
            await upsertStreamUser({
                id: recipient._id.toString(),
                name: recipient.fullName,
                image: recipient.profilePicture || "",
                status: recipient.status,
                availability: recipient.availability
            });
        } catch (streamError) {
            console.error("Error updating Stream users:", streamError);
        }

        res.status(200).json({ message: "Friend request accepted successfully." });
    } catch (error) {
        console.error("Error accepting friend request:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function getFriendRequests(req, res) {
    try {
        // Demandes reçues en attente
        const incomingRequests = await FriendRequest.find({ recipient: req.user.id, status: "pending" })
            .populate("sender", "fullName profilePicture bio nativeLanguage learningLanguage location interests status availability");

        // Demandes que j'ai acceptées (je suis le destinataire)
        const acceptedRequests = await FriendRequest.find({ 
            recipient: req.user.id, 
            status: "accepted" 
        }).populate("sender", "fullName profilePicture bio nativeLanguage learningLanguage location interests status availability");

        // Demandes que j'ai envoyées et qui ont été acceptées (je suis l'expéditeur)
        const myAcceptedRequests = await FriendRequest.find({ 
            sender: req.user.id, 
            status: "accepted" 
        }).populate("recipient", "fullName profilePicture bio nativeLanguage learningLanguage location interests status availability");

        // Combiner les deux types de demandes acceptées
        const allAcceptedRequests = [
            ...acceptedRequests.map(req => ({
                ...req.toObject(),
                type: 'received'
            })),
            ...myAcceptedRequests.map(req => ({
                ...req.toObject(),
                type: 'sent'
            }))
        ];

        res.status(200).json({ 
            incomingRequests, 
            acceptedRequests: allAcceptedRequests 
        });       
    } catch (error) {
        console.error("Error fetching friend requests:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function getOutgoingFriendRequests(req, res) {
    try {
        const outgoingRequests = await FriendRequest.find({ sender: req.user.id, status: "pending" })
            .populate("recipient", "fullName profilePicture bio nativeLanguage learningLanguage location interests status availability");
        res.status(200).json({ outgoingRequests });
    } catch (error) {
        console.error("Error fetching outgoing friend requests:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function getProfile(req, res) {
    try {
        const user = await User.findById(req.user.id)
            .select('-password -__v');
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function updateProfile(req, res) {
    try {
        const {
            fullName,
            bio,
            profilePicture,
            coverPicture,
            nativeLanguage,
            learningLanguage,
            location,
            interests,
            socialLinks,
            status,
            availability,
            preferences
        } = req.body;

        const updateData = {
            ...(fullName && { fullName }),
            ...(bio && { bio }),
            ...(profilePicture && { profilePicture }),
            ...(coverPicture && { coverPicture }),
            ...(nativeLanguage && { nativeLanguage }),
            ...(learningLanguage && { learningLanguage }),
            ...(location && { location }),
            ...(interests && { interests }),
            ...(socialLinks && { socialLinks }),
            ...(status && { status }),
            ...(availability && { availability }),
            ...(preferences && { preferences })
        };

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select('-password -__v');

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Mettre à jour l'utilisateur Stream si nécessaire
        try {
            await upsertStreamUser({
                id: updatedUser._id.toString(),
                name: updatedUser.fullName,
                image: updatedUser.profilePicture || "",
                status: updatedUser.status,
                availability: updatedUser.availability
            });
        } catch (streamError) {
            console.error("Error updating Stream user:", streamError);
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function updatePreferences(req, res) {
    try {
        const { theme, notifications, privacy } = req.body;

        const updateData = {
            ...(theme && { 'preferences.theme': theme }),
            ...(notifications && { 'preferences.notifications': notifications }),
            ...(privacy && { 'preferences.privacy': privacy })
        };

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updateData },
            { new: true }
        ).select('-password -__v');

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(updatedUser.preferences);
    } catch (error) {
        console.error("Error updating preferences:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function blockUser(req, res) {
    try {
        const { userId } = req.params;
        
        if (userId === req.user.id) {
            return res.status(400).json({ message: "You cannot block yourself" });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Vérifier si l'utilisateur est déjà bloqué
        if (user.blockedUsers.includes(userId)) {
            return res.status(400).json({ message: "User is already blocked" });
        }

        // Ajouter l'utilisateur à la liste des utilisateurs bloqués
        user.blockedUsers.push(userId);

        // Retirer l'utilisateur de la liste des amis s'il y est
        user.friends = user.friends.filter(id => id.toString() !== userId);

        // Retirer l'utilisateur actuel de la liste des amis de l'utilisateur bloqué
        await User.findByIdAndUpdate(userId, {
            $pull: { friends: user._id }
        });

        await user.save();

        res.status(200).json({ message: "User blocked successfully" });
    } catch (error) {
        console.error("Error blocking user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function unblockUser(req, res) {
    try {
        const { userId } = req.params;
        
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Vérifier si l'utilisateur est bloqué
        if (!user.blockedUsers.includes(userId)) {
            return res.status(400).json({ message: "User is not blocked" });
        }

        // Retirer l'utilisateur de la liste des utilisateurs bloqués
        user.blockedUsers = user.blockedUsers.filter(id => id.toString() !== userId);
        await user.save();

        res.status(200).json({ message: "User unblocked successfully" });
    } catch (error) {
        console.error("Error unblocking user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function getBlockedUsers(req, res) {
    try {
        const user = await User.findById(req.user.id)
            .select('blockedUsers')
            .populate('blockedUsers', 'fullName profilePicture');
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user.blockedUsers);
    } catch (error) {
        console.error("Error fetching blocked users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

