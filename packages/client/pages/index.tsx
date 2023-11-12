import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

// Context
import StatusContext from '../contexts/status/StatusContext';
import BlocksContext from '../contexts/blocks/BlocksContext';
import EpochsContext from '../contexts/epochs/EpochsContext';
import ThemeModeContext from '../contexts/theme-mode/ThemeModeContext';

// Components
import Layout from '../components/layouts/Layout';
import ChainOverview from '../components/layouts/ChainOverview';
import Statitstics from '../components/layouts/Statitstics';
import Problems from '../components/layouts/Problems';
import SummaryOverview from '../components/ui/SummaryOverview';

export default function Home() {
    // Router
    const router = useRouter();
    const { network } = router.query;

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
                    <div className='text-center mb-5 mt-14 xl:mt-0'>
                        <h1
                            className='text-[32px] md:text-[50px] capitalize font-semibold text-black'
                            style={{
                                color: themeMode?.darkMode ? 'var(--white)' : 'var(--black)',
                            }}
                        >
                            Ethereum blockchain explorer
                        </h1>
                    </div>

                    <div
                        className='mx-auto py-4 px-6 text-[14px] 2xl:text-[18px] border rounded-md w-11/12 lg:w-10/12 mb-5'
                        style={{
                            background: themeMode?.darkMode ? 'var(--bgDarkMode)' : 'var(--bgMainLightMode)',
                            borderColor: themeMode?.darkMode ? 'var(--white)' : 'var(--lightGray)',
                        }}
                    >
                        <h2
                            className='text-center'
                            style={{
                                color: themeMode?.darkMode ? 'var(--white)' : 'var(--black)',
                            }}
                        >
                            EthSeer provides information about the Beacon Chain of Ethereum. It displays the blocks
                            being produced in real-time with a user-friendly interface and allows users to search for
                            information in an engaging manner to understand the Blockchain.
                        </h2>
                    </div>

                    <SummaryOverview />
                    <ChainOverview />
                    <hr
                        className={`w-11/12 mx-auto my-4 rounded-md border-${
                            themeMode?.darkMode ? 'white' : 'darkGray'
                        }`}
                    ></hr>
                    <div className='text-center mt-3'>
                        <h2
                            className='text-[26px] md:text-[34px] font-semibold capitalize mb-3'
                            style={{
                                color: themeMode?.darkMode ? 'var(--white)' : 'var(--black)',
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
