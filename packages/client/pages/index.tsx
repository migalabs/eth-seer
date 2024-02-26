import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

// Context
import StatusContext from '../contexts/status/StatusContext';
import BlocksContext from '../contexts/blocks/BlocksContext';
import EpochsContext from '../contexts/epochs/EpochsContext';

// Components
import Layout from '../components/layouts/Layout';
import ChainOverview from '../components/layouts/ChainOverview';
import Statitstics from '../components/layouts/Statistics';
import Problems from '../components/layouts/Problems';
import SummaryOverview from '../components/ui/SummaryOverview';
import Title from '../components/ui/Title';
import PageDescription from '../components/ui/PageDescription';
import CountdownBanner from '../components/ui/CountdownBanner';

export default function Home() {
    // Router
    const router = useRouter();
    const { network } = router.query;

    // Status Context
    const { status } = useContext(StatusContext) ?? {};

    // Blocks Context
    const { startEventSource: startEventSourceBlocks, closeEventSource: closeEventSourceBlocks } =
        useContext(BlocksContext) ?? {};

    // Epochs Context
    const { startEventSource: startEventSourceEpochs, closeEventSource: closeEventSourceEpochs } =
        useContext(EpochsContext) ?? {};

    // States
    const [eventSourceBlocksCreated, setEventSourceBlocksCreated] = useState(false);
    const [eventSourceEpochsCreated, setEventSourceEpochsCreated] = useState(false);

    useEffect(() => {
        if (network && !eventSourceBlocksCreated) {
            const eventSourceCreated = startEventSourceBlocks?.(network as string);

            setEventSourceBlocksCreated(true);

            return () => {
                if (eventSourceCreated) {
                    closeEventSourceBlocks?.();
                }
            };
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [network]);

    useEffect(() => {
        if (network && !eventSourceEpochsCreated) {
            const eventSourceCreated = startEventSourceEpochs?.(network as string);

            setEventSourceEpochsCreated(true);

            return () => {
                if (eventSourceCreated) {
                    closeEventSourceEpochs?.();
                }
            };
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [network]);

    return (
        <>
            {status && status.working ? (
                <Layout>
                    <CountdownBanner
                        title='Ethereum Deneb-Cancun EIP-4844 hard fork upgrade'
                        countdownTime={1710284400000}
                    />

                    <Title>Ethereum Blockchain Explorer</Title>

                    <PageDescription>
                        EthSeer provides information about the Beacon Chain of Ethereum. It displays the blocks being
                        produced in real-time with a user-friendly interface and allows users to search for information
                        in an engaging manner to understand the Blockchain.
                    </PageDescription>

                    <SummaryOverview />
                    <ChainOverview />

                    <hr className='w-11/12 mx-auto my-4 rounded-md border-[var(--darkGray)] dark:border-[var(--white)]' />

                    <div className='text-center mt-3'>
                        <h2 className='text-[26px] md:text-[34px] font-semibold capitalize mb-3 text-[var(--black)] dark:text-[var(--white)]'>
                            Epoch statistics
                        </h2>
                        <Statitstics />
                    </div>
                </Layout>
            ) : (
                <Problems />
            )}
        </>
    );
}
