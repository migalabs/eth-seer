import { Router } from 'express';
import { check } from 'express-validator';

import {
    getSlots,
    getBlocks,
    getSlotById,
    getSlotsByGraffiti,
    getWithdrawalsBySlot,
    listenSlotNotification,
} from '../controllers/slots';

import { checkFields } from '../middlewares/check-fields';

const router = Router();

router.get('/', getSlots);

router.get('/blocks', getBlocks);

router.get('/new-slot-notification', listenSlotNotification);

router.get('/:id', [
    check('id').isInt({ min: 0, max: 2147483647 }),
    checkFields,
], getSlotById);

router.get('/graffiti/:id', [
    check('id').notEmpty().withMessage('Graffiti is required'),
    checkFields,
], getSlotsByGraffiti);

router.get('/:id/withdrawals', [
    check('id').isInt({ min: 0, max: 2147483647 }),
    checkFields,
], getWithdrawalsBySlot);

export default router;