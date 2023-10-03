import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

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

    // Router
    const router = useRouter();
    const { network } = router.query;

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

        if (network && !lastValidator) {
            getLastValidator();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [network, blocks]);

    const getLastValidator = async () => {
        try {
            const response = await axiosClient.get('/api/validators/last', {
                params: {
                    network,
                },
            });

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
                        className='grid grid-row-5 xl:flex xl:flex-wrap justify-between w-fit gap-2 xl:gap-10 text-[14px] text-center rounded-md py-4 px-8 xl:px-8 xl:py-3 mx-auto border'
                        style={{
                            color: themeMode?.darkMode ? 'var(--white)' : 'var(--black)',
                            background: themeMode?.darkMode ? 'var(--bgDarkMode)' : 'var(--bgMainLightMode)',
                            borderColor: themeMode?.darkMode ? 'var(--white)' : 'var(--lightGray)',
                        }}
                    >
                        <p className='flex-shrink-0'>
                            <b>Network:</b> {assetPrefix !== '/goerli' ? 'Mainnet' : 'Goerli'}
                        </p>
                        <span className='lg:w-[1px] lg:h-6 lg:bg-gray-400 '></span>
                        <p className='flex-shrink-0'>
                            <b>Epoch:</b> {summary.epoch}
                        </p>
                        <span className='lg:w-[1px] lg:h-6 lg:bg-gray-400'></span>
                        <p className='flex-shrink-0'>
                            <b>Slot:</b> {summary.slot}
                        </p>
                        <span className='lg:w-[1px] lg:h-6 lg:bg-gray-400'></span>
                        <p className='flex-shrink-0'>
                            <b>Block Height:</b> {summary.block_height}
                        </p>
                        <span className='lg:w-[1px] lg:h-6 lg:bg-gray-400'></span>
                        <p className='flex-shrink-0'>
                            <b>Active Validators:</b> {lastValidator ?? 0}
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};

export default SummaryOverview;
