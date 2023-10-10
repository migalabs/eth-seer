import { Router } from 'express';
import { query } from 'express-validator';

import {
    getEntities,
    getEntity,
} from '../controllers/entities';

import { checkFields } from '../middlewares/check-fields';
import { existsNetwork } from '../helpers/network-validator';

const router = Router();

router.get('/:name', [
    query('network').not().isEmpty(),
    query('network').custom(existsNetwork),
    checkFields,
], getEntity);

router.get('/', [
    query('network').not().isEmpty(),
    query('network').custom(existsNetwork),
    checkFields,
], getEntities);

export default router;
