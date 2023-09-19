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
    const assetPrefix = process.env.NEXT_PUBLIC_ASSET_PREFIX ?? '';

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
                        className='grid grid-row-5 xl:flex xl:flex-wrap justify-between w-fit gap-2 xl:gap-10 text-[10px] text-center rounded-[22px] bg-white/20 py-4 px-8 xl:px-8 xl:py-3 mx-auto border-2'
                        style={{
                            color: themeMode?.darkMode ? 'var(--white)' : 'var(--newOrange)',
                            borderColor: themeMode?.darkMode ? 'var(--white)' : 'var(--newOrange)',
                        }}
                    >
                        <p className='flex-shrink-0'>Network: {assetPrefix !== '/goerli' ? 'MAINNET' : 'GOERLI'}</p>
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
