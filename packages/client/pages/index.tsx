import React, { useContext, useEffect, useState } from 'react';

// Context
import StatusContext from '../contexts/status/StatusContext';
import BlocksContext from '../contexts/blocks/BlocksContext';
import EpochsContext from '../contexts/epochs/EpochsContext';

// Components
import Layout from '../components/layouts/Layout';
import ChainOverview from '../components/layouts/ChainOverview';
import Statitstics from '../components/layouts/Statitstics';
import Problems from '../components/layouts/Problems';
import SearchEngine from '../components/ui/SearchEngineBlack';
import SummaryOverview from '../components/layouts/SummaryOverview';

export default function Home() {
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
        if (!eventSourceBlocksCreated) {
            const eventSourceCreated = startEventSourceBlocks?.();

            setEventSourceBlocksCreated(true);

            return () => {
                if (eventSourceCreated) {
                    closeEventSourceBlocks?.();
                }
            };
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!eventSourceEpochsCreated) {
            const eventSourceCreated = startEventSourceEpochs?.();

            setEventSourceEpochsCreated(true);

            return () => {
                if (eventSourceCreated) {
                    closeEventSourceEpochs?.();
                }
            };
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {status && status.working ? (
                <Layout isMain>
                    <SearchEngine />

                    <SummaryOverview />

                    <ChainOverview />

                    <div className='mt-8'>
                        <Statitstics title='Epoch Statistics' />
                    </div>
                </Layout>
            ) : (
                <Problems />
            )}
        </>
    );
}
