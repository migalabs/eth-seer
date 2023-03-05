import { Router } from 'express';

import {
    getEpochsStatistics,
    getBlocks,
    getBlock,
    listenBlockNotification,
    listenEpochNotification,
    getEpoch,
} from '../controllers/validator-rewards-summary';

const router = Router();

router.get('/', getEpochsStatistics);

router.get('/blocks', getBlocks);

router.get('/block/:id', getBlock);

router.get('/epoch/:id', getEpoch);

router.get('/new-block-notification', listenBlockNotification);

router.get('/new-epoch-notification', listenEpochNotification);

export default router;