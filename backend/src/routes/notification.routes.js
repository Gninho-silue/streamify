import express from 'express';
import { getNotifications, markAsRead, getUnreadCount, markAllAsRead } from '../controllers/notification.controller.js';
import { protectedRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', protectedRoute, getNotifications);
router.get('/unread-count', protectedRoute, getUnreadCount);
router.put('/:id/read', protectedRoute, markAsRead);
router.put('/mark-all-read', protectedRoute, markAllAsRead);

export default router; 