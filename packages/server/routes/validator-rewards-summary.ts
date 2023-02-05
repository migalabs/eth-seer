import { Router } from 'express';

import {
    getEpochsStatistics,
    getBlocks,
    getBlock,
    listenBlockNotification,
    listenEpochNotification,
} from '../controllers/validator-rewards-summary';

const router = Router();

router.get('/', getEpochsStatistics);

router.get('/blocks', getBlocks);

router.get('/block/:id', getBlock);

router.get('/new-block-notification', listenBlockNotification);

router.get('/new-epoch-notification', listenEpochNotification);

export default router;