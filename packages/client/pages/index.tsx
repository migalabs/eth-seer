import React, { useContext, useEffect } from 'react';

// Context
import StatusContext from '../contexts/status/StatusContext';
import BlocksContext from '../contexts/blocks/BlocksContext';

// Components
import Layout from '../components/layouts/Layout';
import ChainOverview from '../components/layouts/ChainOverview';
import Statitstics from '../components/layouts/Statitstics';
import Problems from '../components/layouts/Problems';

export default function Home() {
    // Status Context
    const { status } = useContext(StatusContext) || {};

    // Blocks Context
    const { startEventSource, closeEventSource } = useContext(BlocksContext) || {};

    useEffect(() => {
        const eventSourceCreated = startEventSource?.();

        return () => {
            if (eventSourceCreated) {
                closeEventSource?.();
            }
        };
    }, []);

    return (
        <>
            {status && status.working ? (
                <Layout isMain>
                    <ChainOverview />

                    <div className='mt-3'>
                        <Statitstics />
                    </div>
                </Layout>
            ) : (
                <Problems />
            )}
        </>
    );
}
