import { Router } from 'express';
import { check, query } from 'express-validator';

import {
    getEpochsStatistics,
    getEpochById,
    getEpochStats,
    getSlotsByEpoch,
    listenEpochNotification,
} from '../controllers/epochs';

import { checkFields } from '../middlewares/check-fields';
import { existsNetwork } from '../helpers/network-validator';

const router = Router();

router.get('/stats', [
    query('network').not().isEmpty(),
    query('network').custom(existsNetwork),
    checkFields,
], getEpochStats);

router.get('/', [
    query('network').not().isEmpty(),
    query('network').custom(existsNetwork),
    checkFields,
], getEpochsStatistics);

router.get('/new-epoch-notification', [
    query('network').not().isEmpty(),
    query('network').custom(existsNetwork),
    checkFields,
], listenEpochNotification);

router.get('/:id', [
    check('id').isInt({ min: 0, max: 2147483647 }),
    query('network').not().isEmpty(),
    query('network').custom(existsNetwork),
    checkFields,
], getEpochById);

router.get('/:id/slots', [
    check('id').isInt({ min: 0, max: 2147483647 }),
    query('network').not().isEmpty(),
    query('network').custom(existsNetwork),
    checkFields,
], getSlotsByEpoch);

export default router;