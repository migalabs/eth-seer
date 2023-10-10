import { Router } from 'express';
import { query } from 'express-validator';


import { checkFields } from '../middlewares/check-fields';
import { existsNetwork } from '../helpers/network-validator';
import { getNetworks } from '../controllers/networks';

const router = Router();

// router.get('/:name', [
//     query('network').not().isEmpty(),
//     query('network').custom(existsNetwork),
//     checkFields,
// ], getEntity);

router.get('/', [
    checkFields,
], getNetworks);

export default router;
