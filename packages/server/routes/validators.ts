import { Router } from 'express';
import { check, query } from 'express-validator';

import {
    getValidators,
    getValidatorById,
    getValidatorStats,
    getLastValidator,
    getProposedBlocksByValidator,
    getWithdrawalsByValidator,
} from '../controllers/validators';

import { checkFields } from '../middlewares/check-fields';
import { existsNetwork } from '../helpers/network-validator';

const router = Router();

router.get('/stats', [
    query('network').not().isEmpty(),
    query('network').custom(existsNetwork),
    checkFields,
], getValidatorStats);

router.get('/last', [
    query('network').not().isEmpty(),
    query('network').custom(existsNetwork),
    checkFields,
], getLastValidator);

router.get('/', [
    query('network').not().isEmpty(),
    query('network').custom(existsNetwork),
    checkFields,
], getValidators);

router.get('/:id', [
    check('id').isInt({ min: 0, max: 2147483647 }),
    query('network').not().isEmpty(),
    query('network').custom(existsNetwork),
    checkFields,
], getValidatorById);

router.get('/:id/proposed-blocks', [
    check('id').isInt({ min: 0, max: 2147483647 }),
    query('network').not().isEmpty(),
    query('network').custom(existsNetwork),
    checkFields,
], getProposedBlocksByValidator);

router.get('/:id/withdrawals', [
    check('id').isInt({ min: 0, max: 2147483647 }),
    query('network').not().isEmpty(),
    query('network').custom(existsNetwork),
    checkFields,
], getWithdrawalsByValidator);

export default router;