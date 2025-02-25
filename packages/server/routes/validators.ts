import { Router } from 'express';
import { check, query } from 'express-validator';

import {
    getValidators,
    getValidatorById,
    getCountActiveValidators,
    getProposedBlocksByValidator,
    getWithdrawalsByValidator,
    getValidatorsByPool,
} from '../controllers/validators';

import { checkFields } from '../middlewares/check-fields';
import { existsNetwork } from '../helpers/network-validator';

const router = Router();

router.get('/count-active-validators', [
    query('network').not().isEmpty(),
    query('network').custom(existsNetwork),
    checkFields,
], getCountActiveValidators);

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

router.get('/pool/:name', [
    query('network').not().isEmpty(),
    query('network').custom(existsNetwork),
    checkFields,
], getValidatorsByPool);

export default router;