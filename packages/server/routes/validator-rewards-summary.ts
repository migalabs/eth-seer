import { Router } from 'express';

import {
    getEpochsStatistics
} from '../controllers/validator-rewards-summary';

import {
    checkFields
} from '../middlewares/check-fields';

const router = Router();

router.get('/validator-rewards-summary', [
    checkFields
], getEpochsStatistics);

export default router;