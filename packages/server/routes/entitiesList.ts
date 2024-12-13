import { Router } from 'express';
import { query } from 'express-validator';

import {
    getEntityList,
} from '../controllers/entitiesList';

import { existsNetwork } from '../helpers/network-validator';

const router = Router();

router.get('/', [
    query('network').not().isEmpty(),
    query('network').custom(existsNetwork),
], getEntityList);

export default router;
