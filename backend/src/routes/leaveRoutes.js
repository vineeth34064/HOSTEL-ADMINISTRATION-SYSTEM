import express from 'express';
import { applyForLeave, decideLeave } from '../controllers/leaveController.js';
import { authRequired } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authRequired, applyForLeave);
router.post('/:id/decision', authRequired, decideLeave);

export default router;
