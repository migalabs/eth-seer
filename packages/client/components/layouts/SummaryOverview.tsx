import React, { useEffect, useState } from 'react';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';
import BlocksContext from '../../contexts/blocks/BlocksContext';

// Types
import { Block } from '../../types';
import axiosClient from '../../config/axios';

type Props = {
    epoch: number;
    blocks: Block[];
    lastEpoch: boolean;
};

type Summary = {
    epoch: number;
    slot: number;
    block_height: number;
};

const SummaryOverview = () => {
    // Theme Mode Context
    const { themeMode } = React.useContext(ThemeModeContext) || {};

    // Blocks Context
    const { blocks, getBlocks } = React.useContext(BlocksContext) || {};

    const [summary, setSummary] = useState<Summary>() || {};
    const [lastValidator, setLastValidator] = useState(0);

    useEffect(() => {
        if (blocks && !blocks.epochs) {
            getBlocks?.(0);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [blocks]);

    useEffect(() => {
        getBlocks?.(0);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (lastValidator == 0) getLastValidator();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lastValidator]);

    useEffect(() => {
        if (blocks && blocks.epochs) {
            // Set the last epoch
            const lastEpochAux = Object.keys(blocks.epochs)
                .map(epoch => parseInt(epoch))
                .sort((a, b) => b - a)[0];
            // Set the last block height
            const lastBlockAux = blocks.epochs[lastEpochAux]
                .map(block => block.f_el_block_number ?? 0)
                .sort((a, b) => b - a)[0];
            // Set the last slot
            const lastSlotAux = blocks.epochs[lastEpochAux].map(block => block.f_slot).sort((a, b) => b - a)[0];

            setSummary({ epoch: lastEpochAux, slot: lastSlotAux, block_height: lastBlockAux });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [blocks]);

    const getLastValidator = async () => {
        const response = await axiosClient.get(`/api/validator-rewards-summary/validator`);
        if (response.data.number_active_validators) setLastValidator(response.data.number_active_validators);
    };

    return (
        <>
            {summary && lastValidator !== 0 && (
                <div className='flex justify-center px-5 mb-5'>
                    <div
                        className='grid grid-cols-2 md:grid-cols-4 gap-y-1 items-center justify-around text-center text-[10px] text-black rounded-[22px] px-3 py-4 md:w-[925px]'
                        style={{
                            backgroundColor: themeMode?.darkMode ? 'var(--yellow2)' : 'var(--blue1)',
                            boxShadow: themeMode?.darkMode ? 'var(--boxShadowYellow1)' : 'var(--boxShadowBlue1)',
                        }}
                    >
                        <p>Epoch: {summary.epoch}</p>
                        <p>Slot: {summary.slot}</p>
                        <p>Block Height: {summary.block_height}</p>
                        <p>Validators: {lastValidator}</p>
                    </div>
                </div>
            )}
        </>
    );
};

export default SummaryOverview;
