import { Router } from 'express';
import { check, query } from 'express-validator';

import {
    getSlots,
    getBlocks,
    getSlotById,
    getSlotsByGraffiti,
    getWithdrawalsBySlot,
    listenSlotNotification,
} from '../controllers/slots';

import { checkFields } from '../middlewares/check-fields';
import { existsNetwork } from '../helpers/network-validator';

const router = Router();

router.get('/', [
    query('network').not().isEmpty(),
    query('network').custom(existsNetwork),
    query('page').optional().isInt({ min: 0, max: 2147483647 }),
    query('limit').optional().isInt({ min: 0, max: 100 }),
    query('epoch').optional().isInt({ min: 0, max: 2147483647 }),
    query('lowerEpoch').optional().isInt({ min: 0, max: 2147483647 }),
    query('upperEpoch').optional().isInt({ min: 0, max: 2147483647 }),
    query('validator').optional().isInt({ min: 0, max: 2147483647 }),
    query('lowerDate').optional().isISO8601(),
    query('upperDate').optional().isISO8601(),
    query('entities').optional().isArray(),
    query('clients').optional().isArray(),
    checkFields,
], getSlots);

router.get('/blocks', [
    query('network').not().isEmpty(),
    query('network').custom(existsNetwork),
    checkFields,
], getBlocks);

router.get('/new-slot-notification', [
    query('network').not().isEmpty(),
    query('network').custom(existsNetwork),
    checkFields,
], listenSlotNotification);

router.get('/:id', [
    check('id').isInt({ min: 0, max: 2147483647 }),
    query('network').not().isEmpty(),
    query('network').custom(existsNetwork),
    checkFields,
], getSlotById);

router.get('/graffiti/:search', [
    query('network').not().isEmpty(),
    query('network').custom(existsNetwork),
    checkFields,
], getSlotsByGraffiti);

router.get('/:id/withdrawals', [
    check('id').isInt({ min: 0, max: 2147483647 }),
    query('network').not().isEmpty(),
    query('network').custom(existsNetwork),
    checkFields,
], getWithdrawalsBySlot);

export default router;