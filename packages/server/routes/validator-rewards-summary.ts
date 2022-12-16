import { Router } from 'express';

import {
    getEpochsStatistics,
    getBlocks
} from '../controllers/validator-rewards-summary';

const router = Router();

router.get('/', getEpochsStatistics);

router.get('/blocks', getBlocks);

export default router;