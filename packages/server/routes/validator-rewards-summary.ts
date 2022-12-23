import { Router } from 'express';

import {
    getEpochsStatistics,
    getBlocks,
    listenBlockNotification,
} from '../controllers/validator-rewards-summary';

const router = Router();

router.get('/', getEpochsStatistics);

router.get('/blocks', getBlocks);

router.get('/new-block-notification', listenBlockNotification);

export default router;