import { Router } from 'express';

import {
    getEpochsStatistics
} from '../controllers/validator-rewards-summary';

import {
    checkFields
} from '../middlewares/check-fields';

const router = Router();

router.get('/', [
    checkFields
], getEpochsStatistics);

export default router;