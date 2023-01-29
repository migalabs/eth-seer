import React, { useContext } from 'react';

// Context
import StatusContext from '../contexts/status/StatusContext';

// Components
import Layout from '../components/layouts/Layout';
import ChainOverview from '../components/layouts/ChainOverview';
import Statitstics from '../components/layouts/Statitstics';
import Problems from '../components/layouts/Problems';

export default function Home() {
    // Status Context
    const { status } = useContext(StatusContext) || {};

    return (
        <>
            {status && status.working ? (
                <Layout>
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
