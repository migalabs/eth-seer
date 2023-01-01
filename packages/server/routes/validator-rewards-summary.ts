import { Router } from 'express';

import {
    getEpochsStatistics,
    getBlocks,
    listenBlockNotification,
    listenEpochNotification,
} from '../controllers/validator-rewards-summary';

const router = Router();

router.get('/', getEpochsStatistics);

router.get('/blocks', getBlocks);

router.get('/new-block-notification', listenBlockNotification);

router.get('/new-epoch-notification', listenEpochNotification);

export default router;