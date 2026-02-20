import express from 'express';
import { getAdminDashboard } from '../controllers/adminController.js';
import { authRequired, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard', authRequired, requireRole('admin'), getAdminDashboard);

export default router;
