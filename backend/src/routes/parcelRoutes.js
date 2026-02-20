import express from 'express';
import { getStudentParcels, addParcel, collectParcel } from '../controllers/parcelController.js';
import { authRequired, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/student/:studentId', authRequired, getStudentParcels);
router.post('/', authRequired, requireRole('admin'), addParcel);
router.post('/:id/collect', authRequired, collectParcel);

export default router;
