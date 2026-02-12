import express from 'express';
import { fileComplaint, decideComplaint } from '../controllers/complaintController.js';
import { authRequired } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authRequired, fileComplaint);
router.post('/:id/decision', authRequired, decideComplaint);

export default router;
