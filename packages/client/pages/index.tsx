import React, { useContext, useEffect, useState } from 'react';

// Context
import StatusContext from '../contexts/status/StatusContext';
import BlocksContext from '../contexts/blocks/BlocksContext';
import EpochsContext from '../contexts/epochs/EpochsContext';
import ThemeModeContext from '.././contexts/theme-mode/ThemeModeContext';

// Components
import Layout from '../components/layouts/Layout';
import ChainOverview from '../components/layouts/ChainOverview';
import Statitstics from '../components/layouts/Statitstics';
import Problems from '../components/layouts/Problems';
import SummaryOverview from '../components/ui/SummaryOverview';

export default function Home() {
    // Theme Mode Context
    const { themeMode } = React.useContext(ThemeModeContext) ?? {};

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
                <Layout>
                    <div className='text-center mb-5 mt-14 xl:mt-0'>
                        <h1
                            className='text-[30px] md:text-[40px] capitalize font-semibold'
                            style={{
                                color: themeMode?.darkMode ? 'var(--white)' : 'var(--black)',
                            }}
                        >
                            Ethereum blockchain explorer
                        </h1>
                    </div>

                    <div
                        className='mx-auto py-4 px-6 text-[12px] md:text-[16px] border rounded-md w-10/12 lg:w-10/12 mb-5'
                        style={{
                            background: themeMode?.darkMode ? 'var(--bgStrongDarkMode)' : 'var(--bgMainLightMode)',
                            borderColor: themeMode?.darkMode ? 'var(--white)' : 'var(--lightGray)',
                        }}
                    >
                        <h2
                            className='text- text-center'
                            style={{
                                color: themeMode?.darkMode ? 'var(--white)' : 'var(--newOrange)',
                            }}
                        >
                            EthSeer provides information about the Beacon Chain of Ethereum. It displays the blocks
                            being produced in real-time with a user-friendly interface and allows users to search for
                            information in an engaging manner to understand the Blockchain.
                        </h2>
                    </div>

                    <SummaryOverview />
                    <ChainOverview />

                    <div className='text-center mt-3'>
                        <h2
                            className='text-lg md:text-[28px] font-medium capitalize mb-3'
                            style={{
                                color: themeMode?.darkMode ? 'var(--white)' : '',
                            }}
                        >
                            Epoch statistics
                        </h2>
                        <Statitstics showCalculatingEpochs />
                    </div>
                </Layout>
            ) : (
                <Problems />
            )}
        </>
    );
}
