import { Router } from 'express';
import { check, checkSchema, query } from 'express-validator';

import { checkFields } from '../middlewares/check-fields';

import {
    getSlashedVals,
    getSlashedValsById
} from '../controllers/slashedValidators';

import { existsNetwork } from '../helpers/network-validator';

const router = Router();

router.get('/', [
    query('network').not().isEmpty(),
    query('network').custom(existsNetwork),
    checkFields
], getSlashedVals);

router.get('/:id', [
    check('id').isInt({ min: 0, max: 2147483647 }),
    query('network').not().isEmpty(),
    query('network').custom(existsNetwork),
    checkFields,
], getSlashedValsById);

export default router;