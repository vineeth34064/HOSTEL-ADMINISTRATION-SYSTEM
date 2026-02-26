import express from 'express';
import { sendEmergencyAlert, acknowledgeEmergencyAlert } from '../controllers/emergencyController.js';
import { authRequired } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authRequired, sendEmergencyAlert);
router.post('/:id/acknowledge', authRequired, acknowledgeEmergencyAlert);

export default router;
