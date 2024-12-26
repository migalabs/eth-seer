import { Router } from 'express';
import { check, query } from 'express-validator';

import {
    getSlashedVals,
} from '../controllers/slashedValidators';

import { existsNetwork } from '../helpers/network-validator';

const router = Router();

router.get('/', [
    query('network').not().isEmpty(),
    query('network').custom(existsNetwork),
], getSlashedVals);

export default router;