import React, { useEffect, useState } from 'react';

// Axios
import axiosClient from '../../config/axios';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';
import BlocksContext from '../../contexts/blocks/BlocksContext';

type Summary = {
    epoch: number;
    slot: number;
    block_height: number;
};

const SummaryOverview = () => {
    // Theme Mode Context
    const { themeMode } = React.useContext(ThemeModeContext) ?? {};

    // Blocks Context
    const { blocks, getBlocks } = React.useContext(BlocksContext) ?? {};

    // States
    const [summary, setSummary] = useState<Summary>() ?? {};
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
        const response = await axiosClient.get('/api/validators/last');
        if (response.data.number_active_validators) setLastValidator(response.data.number_active_validators);
    };

    return (
        <>
            {summary && lastValidator !== 0 && (
                <div className='px-2 mb-5'>
                    <div
                        className='flex flex-wrap justify-between w-fit gap-y-4 gap-x-8 text-[10px] text-black rounded-[22px] px-8 py-4 mx-auto'
                        style={{
                            backgroundColor: themeMode?.darkMode ? 'var(--yellow2)' : 'var(--blue1)',
                            boxShadow: themeMode?.darkMode ? 'var(--boxShadowYellow1)' : 'var(--boxShadowBlue1)',
                        }}
                    >
                        <p className='flex-shrink-0'>Epoch: {summary.epoch}</p>
                        <p className='flex-shrink-0'>Slot: {summary.slot}</p>
                        <p className='flex-shrink-0'>Block Height: {summary.block_height}</p>
                        <p className='flex-shrink-0'>Active Validators: {lastValidator}</p>
                    </div>
                </div>
            )}
        </>
    );
};

export default SummaryOverview;
