import { Router } from 'express';
import { query } from 'express-validator';

import {
    getTransactions,
    getTransactionByHash,
} from '../controllers/transactions';

import { checkFields } from '../middlewares/check-fields';
import { existsNetwork } from '../helpers/network-validator';

const router = Router();

router.get('/', [
    query('network').not().isEmpty(),
    query('network').custom(existsNetwork),
    checkFields,
], getTransactions);

router.get('/:hash', [
    query('network').not().isEmpty(),
    query('network').custom(existsNetwork),
    checkFields,
], getTransactionByHash);

export default router;
