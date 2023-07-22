import { Router } from 'express';
import { check } from 'express-validator';

import {
    getValidatorById,
    getLastValidator,
    getProposedBlocksByValidator,
    getWithdrawalsByValidator,
} from '../controllers/validators';

import { checkFields } from '../middlewares/check-fields';

const router = Router();

router.get('/last', getLastValidator);

router.get('/:id', [
    check('id').isInt({ min: 0, max: 2147483647 }),
    checkFields,
], getValidatorById);

router.get('/:id/proposed-blocks', [
    check('id').isInt({ min: 0, max: 2147483647 }),
    checkFields,
], getProposedBlocksByValidator);

router.get('/:id/withdrawals', [
    check('id').isInt({ min: 0, max: 2147483647 }),
    checkFields,
], getWithdrawalsByValidator);

export default router;