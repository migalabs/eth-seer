import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';

// Axios
import axiosClient from '../../config/axios';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

// Components
import Layout from '../../components/layouts/Layout';
import ProgressSmoothBar from '../../components/ui/ProgressSmoothBar';
import InfoBox from '../../components/layouts/InfoBox';
import Loader from '../../components/ui/Loader';
import Slots from '../../components/layouts/Slots';
import TitleWithArrows from '../../components/ui/TitleWithArrows';
import CardContent from '../../components/ui/CardContent';
import ShareMenu from '../../components/ui/ShareMenu';

// Types
import { Epoch, Slot } from '../../types';

// Props
interface Props {
    id: number;
    network: string;
}

// Server Side Props
export const getServerSideProps: GetServerSideProps = async context => {
    const id = context.params?.id;
    const network = context.query?.network;

    if (isNaN(Number(id)) || !network) {
        return {
            notFound: true,
        };
    }

    return { props: { id: Number(id), network } };
};

const EpochComponent = ({ id, network }: Props) => {
    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) ?? {};

    // Refs
    const idRef = useRef(0);
    const existsEpochRef = useRef(true);

    // States
    const [epoch, setEpoch] = useState<Epoch | null>(null);
    const [slots, setSlots] = useState<Slot[]>([]);
    const [infoBoxText, setInfoBoxText] = useState('');
    const [loadingEpoch, setLoadingEpoch] = useState(true);
    const [loadingSlots, setLoadingSlots] = useState(true);
    const [blockGenesis, setBlockGenesis] = useState(0);
    const [calculatingText, setCalculatingText] = useState('');

    // UseEffect
    useEffect(() => {
        if (!epoch || idRef.current !== id) {
            idRef.current = id;
            getEpoch();
            getSlots();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const shuffle = useCallback(() => {
        setCalculatingText(prevState => {
            if (!prevState || prevState === 'Calculating...') {
                return 'Calculating';
            } else {
                return prevState + '.';
            }
        });
    }, []);

    useEffect(() => {
        const intervalID = setInterval(shuffle, 1000);
        return () => clearInterval(intervalID);
    }, [shuffle]);

    // Get Epoch
    const getEpoch = async () => {
        try {
            setLoadingEpoch(true);

            const [response, genesisBlock] = await Promise.all([
                axiosClient.get(`/api/epochs/${id}`, {
                    params: {
                        network,
                    },
                }),
                axiosClient.get('/api/networks/block/genesis', {
                    params: {
                        network,
                    },
                }),
            ]);

            setEpoch(response.data.epoch);
            setBlockGenesis(genesisBlock.data.block_genesis);

            if (Number(response.data.epoch.proposed_blocks) === 0) {
                setInfoBoxText("We're not there yet");

                const expectedTimestamp = (genesisBlock.data.block_genesis + id * 12000 * 32 + 12000 * 64) / 1000;

                existsEpochRef.current = false;

                const timeDifference = new Date(expectedTimestamp * 1000).getTime() - new Date().getTime();

                if (timeDifference > 2147483647) {
                    return;
                } else if (timeDifference > 0) {
                    setTimeout(() => {
                        if (id === idRef.current) {
                            getEpoch();
                        }
                    }, timeDifference + 2000);
                } else if (timeDifference > -30000) {
                    setTimeout(() => {
                        if (id === idRef.current) {
                            getEpoch();
                        }
                    }, 1000);
                } else if (timeDifference < -30000) {
                    setInfoBoxText('Epoch not saved yet');
                }
            } else {
                setInfoBoxText('');
                existsEpochRef.current = true;
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingEpoch(false);
        }
    };

    // Get Slots
    const getSlots = async () => {
        try {
            setLoadingSlots(true);

            const response = await axiosClient.get(`/api/epochs/${id}/slots`, {
                params: {
                    network,
                },
            });

            setSlots(response.data.slots);
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingSlots(false);
        }
    };
    console.log(id > 74239);
    // Epoch stats card
    const getContentEpochStats = () => (
        <div
            className='flex flex-col gap-y-4 p-6 md:px-20 md:py-10 text-[14px] md:text-[16px] font-medium rounded-md border-2 border-white text-[var(--darkGray)] dark:text-[var(--white)] bg-[var(--bgMainLightMode)] dark:bg-[var(--bgFairDarkMode)]'
            style={{
                boxShadow: themeMode?.darkMode ? 'var(--boxShadowCardDark)' : 'var(--boxShadowCardLight)',
            }}
        >
            <div className='flex flex-row items-center gap-x-5'>
                <p className='w-40 sm:w-60 text-[var(--black)] dark:text-[var(--white)]'>Time (Local):</p>
                <p className='text-[var(--black)] dark:text-[var(--white)]'>
                    {new Date(blockGenesis + id * 32 * 12000).toLocaleString('ja-JP')}
                </p>
            </div>

            <div className='flex flex-col sm:flex-row gap-x-5'>
                <p className='w-40 sm:w-60 text-[var(--black)] dark:text-[var(--white)]'>Blocks (out of 32):</p>
                <div className='flex justify-center gap-x-4 pt-3 md:pt-0'>
                    <CardContent
                        content={`Proposed: ${epoch?.proposed_blocks}`}
                        color='var(--white)'
                        bg='var(--proposedGreen)'
                        boxShadow='var(--boxShadowRed)'
                        width={160}
                    />
                    <CardContent
                        content={`Missed: ${32 - Number(epoch?.proposed_blocks)}`}
                        color='var(--white)'
                        bg='var(--missedRed)'
                        boxShadow='var(--boxShadowRed)'
                        width={160}
                    />
                </div>
            </div>

            {id && Number(id) > 74239 && (
                <div className='flex flex-col'>
                    <p className='w-40 sm:w-60 text-[var(--black)] dark:text-[var(--white)]'>Attestation Accuracy:</p>
                    {epoch && epoch.f_epoch === undefined && (
                        <p className='w-32 uppercase  ml-10 mt-2 text-start'>{calculatingText}</p>
                    )}
                    {epoch && epoch.f_epoch !== undefined && (
                        <div className='flex flex-col xl:flex-row font-medium items-center gap-2 md:gap-4 text-[12px] md:text-[14px] text-[var(--black)] dark:text-[var(--white)]'>
                            <ProgressSmoothBar
                                title='Target'
                                color='#343434'
                                backgroundColor='#f5f5f5'
                                percent={1 - epoch.f_missing_target / epoch.f_num_att_vals}
                                width={300}
                                tooltipColor='orange'
                                tooltipContent={
                                    <>
                                        <span>Missing Target: {epoch.f_missing_target?.toLocaleString()}</span>
                                        <span>Attestations: {epoch.f_num_att_vals?.toLocaleString()}</span>
                                    </>
                                }
                                widthTooltip={220}
                            />

                            <ProgressSmoothBar
                                title='Source'
                                color='#343434'
                                backgroundColor='#f5f5f5'
                                percent={1 - epoch.f_missing_source / epoch.f_num_att_vals}
                                width={300}
                                tooltipColor='blue'
                                tooltipContent={
                                    <>
                                        <span>Missing Source: {epoch.f_missing_source?.toLocaleString()}</span>
                                        <span>Attestations: {epoch.f_num_att_vals?.toLocaleString()}</span>
                                    </>
                                }
                                widthTooltip={220}
                            />

                            <ProgressSmoothBar
                                title='Head'
                                color='#343434'
                                backgroundColor='#f5f5f5'
                                percent={1 - epoch.f_missing_head / epoch.f_num_att_vals}
                                width={300}
                                tooltipColor='purple'
                                tooltipContent={
                                    <>
                                        <span>Missing Head: {epoch.f_missing_head?.toLocaleString()}</span>
                                        <span>Attestations: {epoch.f_num_att_vals?.toLocaleString()}</span>
                                    </>
                                }
                                widthTooltip={220}
                            />
                        </div>
                    )}
                </div>
            )}
            
            {id && Number(id) > 74239 && (
                <div className='flex flex-col'>
                    <p className='w-40 sm:w-60 text-[var(--black)] dark:text-[var(--white)]'>Voting Participation:</p>
                    {epoch && epoch.f_epoch === undefined && (
                        <p className='w-32 uppercase ml-10 mt-2 text-start'>{calculatingText}</p>
                    )}
                    <div className='pt-3 py-1 mx-auto md:mx-0'>
                        {epoch && epoch.f_epoch !== undefined && (
                            <ProgressSmoothBar
                                title=''
                                color='#343434'
                                backgroundColor='#f5f5f5'
                                width={300}
                                percent={epoch.f_att_effective_balance_eth / epoch.f_total_effective_balance_eth || 0}
                                tooltipColor='blue'
                                tooltipContent={
                                    <>
                                        <span>Agg. Rewards: {epoch?.f_att_effective_balance_eth}</span>
                                        <span>Max. Rewards: {epoch?.f_total_effective_balance_eth}</span>
                                    </>
                                }
                                widthTooltip={220}
                            />
                        )}
                    </div>
                </div>
            )}

            <div className='flex flex-row items-center gap-x-5'>
                <p className='w-40 sm:w-60 text-[var(--black)] dark:text-[var(--white)]'>Withdrawals:</p>
                <p className='text-[var(--black)] dark:text-[var(--white)]'>
                    {((epoch?.withdrawals ?? 0) / 10 ** 9).toLocaleString()} ETH
                </p>
            </div>
        </div>
    );

    return (
        <Layout
            title={`Epoch ${id} Details - Ethereum Beacon Chain | EthSeer.io`}
            description={`Explore comprehensive data for Epoch ${id} on the Ethereum Beacon Chain. Get insights into blocks proposed, attestations, validator performance, and more. Stay updated with EthSeer.io.`}
        >
            <Head>
                <meta name='robots' property='noindex' />
            </Head>

            <TitleWithArrows type='epoch' value={id} />

            {loadingEpoch && (
                <div className='mt-6'>
                    <Loader />
                </div>
            )}

            {!loadingEpoch && epoch && existsEpochRef.current && (
                <div className='flex flex-col gap-y-4'>
                    <div className='flex flex-col gap-y-4 mx-auto w-11/12 xl:w-10/12'>
                        <div className='flex justify-end'>
                            <ShareMenu type='epoch' />
                        </div>

                        {getContentEpochStats()}
                    </div>

                    <Slots slots={slots} fetchingSlots={loadingSlots} />
                </div>
            )}

            {!loadingEpoch && infoBoxText && <InfoBox text={infoBoxText} />}
        </Layout>
    );
};

export default EpochComponent;
