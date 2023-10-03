import { Router } from 'express';
import { check, query } from 'express-validator';

import {
    getSlots,
    getBlocks,
    getSlotById,
    getSlotsStats,
    getSlotsByGraffiti,
    getWithdrawalsBySlot,
    listenSlotNotification,
} from '../controllers/slots';

import { checkFields } from '../middlewares/check-fields';
import { existsNetwork } from '../helpers/network-validator';

const router = Router();

router.get('/stats', [
    query('network').not().isEmpty(),
    query('network').custom(existsNetwork),
    checkFields,
], getSlotsStats);

router.get('/', [
    query('network').not().isEmpty(),
    query('network').custom(existsNetwork),
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

router.get('/graffiti/:id', [
    check('id').notEmpty().withMessage('Graffiti is required'),
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