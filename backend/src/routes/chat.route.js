import express from 'express';
import { protectedRoute } from '../middleware/auth.middleware.js';
import { getStreamToken } from '../controllers/chat.controller.js';

const router = express.Router();

router.get("/token", protectedRoute, getStreamToken);
export default router;