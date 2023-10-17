import { Router } from 'express';
import { query } from 'express-validator';


import { checkFields } from '../middlewares/check-fields';
import { existsNetwork } from '../helpers/network-validator';
import { getBlockGenesis, getNetworks } from '../controllers/networks';

const router = Router();

router.get('/block/genesis', [
    query('network').not().isEmpty(),
    query('network').custom(existsNetwork),
    checkFields,
], getBlockGenesis);

router.get('/', [
    checkFields,
], getNetworks);

export default router;
