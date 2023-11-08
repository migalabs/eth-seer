import { Router } from 'express';
import { check, query } from 'express-validator';

import {
    getBlockById, getTransactionsByBlock,
} from '../controllers/blocks';

import { checkFields } from '../middlewares/check-fields';
import { existsNetwork } from '../helpers/network-validator';

const router = Router();


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


export default router;