import { Router } from 'express';
import { check } from 'express-validator';

import {
    getEpochsStatistics,
    getBlocks,
    getBlock,
    listenBlockNotification,
    listenEpochNotification,
    getEpoch,
} from '../controllers/validator-rewards-summary';

import { checkFields } from '../middlewares/check-fields';

const router = Router();

router.get('/', getEpochsStatistics);

router.get('/blocks', getBlocks);

router.get('/block/:id', [
    check('id').isInt({ min: 0, max: 2147483647 }),
    checkFields,
], getBlock);

router.get('/epoch/:id', [
    check('id').isInt({ min: 0, max: 2147483647 }),
    checkFields,
], getEpoch);

router.get('/new-block-notification', listenBlockNotification);

router.get('/new-epoch-notification', listenEpochNotification);

export default router;