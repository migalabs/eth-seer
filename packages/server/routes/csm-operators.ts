import { Router } from 'express';
import { query } from 'express-validator';

import {
    getCsmOperators,
} from '../controllers/csm-operators';

import { checkFields } from '../middlewares/check-fields';
import { existsNetwork } from '../helpers/network-validator';

const router = Router();

router.get('/', [
    query('network').not().isEmpty(),
    query('network').custom(existsNetwork),
    checkFields,
], getCsmOperators);

export default router;