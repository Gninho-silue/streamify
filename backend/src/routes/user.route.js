import express from 'express';
import { protectedRoute } from '../middleware/auth.middleware.js';
import {
    getRecommendedUsers,
    getMyFriends,
    sendFriendRequest,
    acceptFriendRequest,
    getFriendRequests,
    getOutgoingFriendRequests,
    getProfile,
    updateProfile,
    updatePreferences,
    blockUser,
    unblockUser,
    getBlockedUsers,
    getUserPublicProfile
} from '../controllers/user.controller.js';

const router = express.Router();

// Routes existantes
router.get("/recommended", protectedRoute, getRecommendedUsers);
router.get("/friends", protectedRoute, getMyFriends);
router.post("/friend-request/:userId", protectedRoute, sendFriendRequest);
router.post("/friend-request/:requestId/accept", protectedRoute, acceptFriendRequest);
router.get("/friend-requests", protectedRoute, getFriendRequests);
router.get("/outgoing-friend-requests", protectedRoute, getOutgoingFriendRequests);

// Nouvelles routes pour le profil
router.get("/profile", protectedRoute, getProfile);
router.put("/profile", protectedRoute, updateProfile);
router.put("/preferences", protectedRoute, updatePreferences);

// Routes pour la gestion des utilisateurs bloqués
router.post("/block/:userId", protectedRoute, blockUser);
router.delete("/block/:userId", protectedRoute, unblockUser);
router.get("/blocked", protectedRoute, getBlockedUsers);

router.get("/:id", protectedRoute, getUserPublicProfile);

export default router;