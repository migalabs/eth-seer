import { Router } from 'express';
import { query } from 'express-validator';

import {
    getOperators,
} from '../controllers/operators';

import { checkFields } from '../middlewares/check-fields';
import { existsNetwork } from '../helpers/network-validator';

const router = Router();

router.get('/', [
    query('network').not().isEmpty(),
    query('network').custom(existsNetwork),
    checkFields,
], getOperators);

export default router;