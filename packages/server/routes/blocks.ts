import { Router } from 'express';
import { check, query } from 'express-validator';

import {
    getLatestBlock,
    getBlockById,
    getTransactionsByBlock,
    getBlocks,
} from '../controllers/blocks';

import { checkFields } from '../middlewares/check-fields';
import { existsNetwork } from '../helpers/network-validator';

const router = Router();

router.get('/latest', [
    query('network').not().isEmpty(),
    query('network').custom(existsNetwork),
    checkFields,
], getLatestBlock);

router.get('/:id', [
    check('id').isInt({ min: 0, max: 2147483647 }),
    query('network').not().isEmpty(),
    query('network').custom(existsNetwork),
    checkFields,
], getBlockById);

router.get('/:id/transactions', [
    check('id').isInt({ min: 0, max: 2147483647 }),
    query('network').not().isEmpty(),
    query('network').custom(existsNetwork),
    checkFields,
], getTransactionsByBlock);

router.get('/', [
    query('network').not().isEmpty(),
    query('network').custom(existsNetwork),
    checkFields,
], getBlocks);


export default router;