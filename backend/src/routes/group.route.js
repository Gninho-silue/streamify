import express from 'express';
import { protectedRoute } from '../middleware/auth.middleware.js';
import {
    createGroup,
    getPublicGroups,
    getUserGroups,
    getGroupById,
    joinGroup,
    leaveGroup,
    updateGroup,
    deleteGroup,
    searchGroups,
    promoteMember,
    demoteMember,
    removeMember,
    getAvailableRoles
} from '../controllers/group.controller.js';

const router = express.Router();

// Routes publiques (avec auth)
router.get('/public', protectedRoute, getPublicGroups);
router.get('/search', protectedRoute, searchGroups);
router.get('/roles', protectedRoute, getAvailableRoles);

// Routes utilisateur
router.get('/my-groups', protectedRoute, getUserGroups);
router.post('/', protectedRoute, createGroup);

// Routes de groupe spécifique
router.get('/:id', protectedRoute, getGroupById);
router.post('/:id/join', protectedRoute, joinGroup);
router.post('/:id/leave', protectedRoute, leaveGroup);
router.put('/:id', protectedRoute, updateGroup);
router.delete('/:id', protectedRoute, deleteGroup);

// Routes de gestion des membres (admin seulement)
router.post('/:id/members/promote', protectedRoute, promoteMember);
router.post('/:id/members/demote', protectedRoute, demoteMember);
router.post('/:id/members/remove', protectedRoute, removeMember);

export default router;
