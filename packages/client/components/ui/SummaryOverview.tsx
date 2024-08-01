import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

// Axios
import axiosClient from '../../config/axios';

// Contexts
import BlocksContext from '../../contexts/blocks/BlocksContext';

type Summary = {
    epoch: number;
    slot: number;
    block_height: number;
};

const SummaryOverview = () => {
    // Router
    const router = useRouter();
    const { network } = router.query;

    // Blocks Context
    const { blocks } = React.useContext(BlocksContext) ?? {};

    // States
    const [summary, setSummary] = useState<Summary | null>(null);
    const [countActiveValidators, setCountActiveValidators] = useState(0);

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

        if (network && !countActiveValidators) {
            getLastValidator();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [network, blocks]);

    const getLastValidator = async () => {
        try {
            const response = await axiosClient.get('/api/validators/count-active-validators', {
                params: {
                    network,
                },
            });

            setCountActiveValidators(response.data.count_active_validators);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            {summary && countActiveValidators !== 0 && (
                <div className='mb-5'>
                    <div className='grid mx-auto grid-row-5 xl:flex xl:flex-wrap justify-around items-center gap-1 xl:gap-10 text-center text-[14px] rounded-md py-4 px-8 xl:px-8 xl:py-3 w-11/12 md:w-9/12 border text-[var(--black)] dark:text-[var(--white)] bg-[var(--bgMainLightMode)] dark:bg-[var(--bgDarkMode)] border-[var(--lightGray)] dark:border-[var(--white)]'>
                        <p>
                            <b className='font-semibold'>Network:</b>{' '}
                            {(network as string).charAt(0).toUpperCase() + (network as string).slice(1)}
                        </p>
                        <span className='lg:w-[1px] lg:h-6 lg:bg-gray-400 '></span>
                        <p className=''>
                            <b className='font-semibold'>Epoch:</b> {summary.epoch}
                        </p>
                        <span className='lg:w-[1px] lg:h-6 lg:bg-gray-400'></span>
                        <p className=''>
                            <b className='font-semibold'>Slot:</b> {summary.slot}
                        </p>
                        <span className='lg:w-[1px] lg:h-6 lg:bg-gray-400'></span>
                        <p className=''>
                            <b className='font-semibold'>Block Height:</b> {summary.block_height}
                        </p>
                        <span className='lg:w-[1px] lg:h-6 lg:bg-gray-400'></span>
                        <p className=''>
                            <b className='font-semibold'>Active Validators:</b> {countActiveValidators ?? 0}
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};

export default SummaryOverview;
