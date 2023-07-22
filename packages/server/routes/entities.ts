import { Router } from 'express';

import {
    getEntity,
} from '../controllers/entities';

const router = Router();

router.get('/:name', getEntity);

export default router;
