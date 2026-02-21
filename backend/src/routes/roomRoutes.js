import express from 'express';
import { getAllRooms, allocateRoom, unassignRoom } from '../controllers/roomController.js';
import { authRequired, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authRequired, getAllRooms);
router.post('/allocate', authRequired, requireRole('admin'), allocateRoom);
router.post('/:roomId/unassign', authRequired, requireRole('admin'), unassignRoom);

export default router;
