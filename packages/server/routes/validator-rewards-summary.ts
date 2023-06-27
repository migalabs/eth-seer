import { Router } from 'express';
import { check } from 'express-validator';

import {
    getEpochsStatistics,
    getBlocks,
    getBlocksByGraffiti,
    getBlockById,
    getWithdrawalsByBlockId,
    listenBlockNotification,
    listenEpochNotification,
    getEpochById,
    getValidator,
    getEntity,
    getSlotsByEpochId,
    getProposedBlocksByValidatorId,
    getWithdrawalsByValidatorId,
    getLastValidator,
} from '../controllers/validator-rewards-summary';

import { checkFields } from '../middlewares/check-fields';

const router = Router();

router.get('/', getEpochsStatistics);

router.get('/blocks', getBlocks);

router.get('/validator', getLastValidator);

router.get('/blocks/graffiti/:id', [
    check('id').notEmpty().withMessage('Graffiti is required'),
    checkFields,
], getBlocksByGraffiti);

router.get('/block/:id', [
    check('id').isInt({ min: 0, max: 2147483647 }),
    checkFields,
], getBlockById);

router.get('/block/:id/withdrawals', [
    check('id').isInt({ min: 0, max: 2147483647 }),
    checkFields,
], getWithdrawalsByBlockId);

router.get('/epoch/:id', [
    check('id').isInt({ min: 0, max: 2147483647 }),
    checkFields,
], getEpochById);

router.get('/epoch/:id/slots', [
    check('id').isInt({ min: 0, max: 2147483647 }),
    checkFields,
], getSlotsByEpochId);

router.get('/validator/:id', [
    check('id').isInt({ min: 0, max: 2147483647 }),
    checkFields,
], getValidator);

router.get('/validator/:id/proposed-blocks', [
    check('id').isInt({ min: 0, max: 2147483647 }),
    checkFields,
], getProposedBlocksByValidatorId);

router.get('/validator/:id/withdrawals', [
    check('id').isInt({ min: 0, max: 2147483647 }),
    checkFields,
], getWithdrawalsByValidatorId);

router.get('/entity/:name', [
    checkFields,
], getEntity);

router.get('/new-block-notification', listenBlockNotification);

router.get('/new-epoch-notification', listenEpochNotification);

export default router;