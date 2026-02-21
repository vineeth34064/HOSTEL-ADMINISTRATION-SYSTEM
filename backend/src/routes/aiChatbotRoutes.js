import express from 'express';
import { handleChatbotMessage } from '../controllers/aiChatbotController.js';
import { authRequired } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authRequired, handleChatbotMessage);

export default router;
