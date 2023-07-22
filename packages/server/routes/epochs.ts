import { Router } from 'express';
import { check } from 'express-validator';

import {
    getEpochsStatistics,
    getEpochById,
    getSlotsByEpoch,
    listenEpochNotification,
} from '../controllers/epochs';

import { checkFields } from '../middlewares/check-fields';

const router = Router();

router.get('/', getEpochsStatistics);

router.get('/new-epoch-notification', listenEpochNotification);

router.get('/:id', [
    check('id').isInt({ min: 0, max: 2147483647 }),
    checkFields,
], getEpochById);

router.get('/:id/slots', [
    check('id').isInt({ min: 0, max: 2147483647 }),
    checkFields,
], getSlotsByEpoch);

export default router;