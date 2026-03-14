import express from 'express';
import { updateMessMenu } from '../controllers/messMenuController.js';
import { authRequired, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.put('/', authRequired, requireRole('admin'), updateMessMenu);

export default router;
