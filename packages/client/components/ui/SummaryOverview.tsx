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
    const { blocks } = React.useContext(BlocksContext) ?? {};

    // States
    const [summary, setSummary] = useState<Summary>() ?? {};
    const [lastValidator, setLastValidator] = useState(null);

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

        if (!lastValidator) {
            getLastValidator();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [blocks]);

    const getLastValidator = async () => {
        try {
            const response = await axiosClient.get('/api/validators/last');

            setLastValidator(response.data.number_active_validators);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            {summary && lastValidator !== 0 && (
                <div className='px-4 mb-5'>
                    <div
                        className='grid grid-row-4 md:flex md:flex-wrap justify-between w-fit gap-2 md:gap-10 text-[10px] text-center text-white rounded-[22px] bg-white/20 py-4 px-8 md:px-8 md:py-3 mx-auto border-2'
                        style={{
                            borderColor: themeMode?.darkMode ? 'var(--yellow4)' : 'var(--blue1)',
                            color: themeMode?.darkMode ? 'var(--yellow4)' : 'var(--blue1)',
                            backgroundColor: themeMode?.darkMode ? '' : 'var(--blue5)',
                        }}
                    >
                        <p className='flex-shrink-0'>Epoch: {summary.epoch}</p>
                        <p className='flex-shrink-0'>Slot: {summary.slot}</p>
                        <p className='flex-shrink-0'>Block Height: {summary.block_height}</p>
                        <p className='flex-shrink-0'>Active Validators: {lastValidator ?? 0}</p>
                    </div>
                </div>
            )}
        </>
    );
};

export default SummaryOverview;