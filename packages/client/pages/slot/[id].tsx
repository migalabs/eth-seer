import React, { useEffect, useState, useRef, useContext } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';

// Axios
import axiosClient from '../../config/axios';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

// Hooks
import useLargeView from '../../hooks/useLargeView';
import useCountdownText from '../../hooks/useCountdownText';

// Components
import Layout from '../../components/layouts/Layout';
import TabHeader from '../../components/ui/TabHeader';
import Loader from '../../components/ui/Loader';
import LinkValidator from '../../components/ui/LinkValidator';
import LinkEpoch from '../../components/ui/LinkEpoch';
import LinkEntity from '../../components/ui/LinkEntity';
import LinkBlock from '../../components/ui/LinkBlock';
import Card from '../../components/ui/Card';
import TitleWithArrows from '../../components/ui/TitleWithArrows';
import { LargeTable, LargeTableHeader, LargeTableRow, SmallTable, SmallTableCard } from '../../components/ui/Table';
import AddressCopy from '../../components/ui/AddressCopy';
import ShareMenu from '../../components/ui/ShareMenu';

// Types
import { Block, Withdrawal } from '../../types';

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

const Slot = ({ id, network }: Props) => {
    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) ?? {};

    // Refs
    const idRef = useRef(0);

    // Large View Hook
    const isLargeView = useLargeView();

    // States
    const [block, setBlock] = useState<Block | null>(null);
    const [withdrawals, setWithdrawals] = useState<Array<Withdrawal>>([]);
    const [existsBlock, setExistsBlock] = useState(false);
    const [tabPageIndex, setTabPageIndex] = useState(0);
    const [loadingBlock, setLoadingBlock] = useState(true);
    const [loadingWithdrawals, setLoadingWithdrawals] = useState(true);
    const [blockGenesis, setBlockGenesis] = useState(0);

    // Countdown Text Hook
    const countdownText = useCountdownText((!block?.f_el_block_number && block?.f_timestamp) || undefined);

    useEffect(() => {
        if (!block || idRef.current !== id) {
            idRef.current = id;
            getBlock();
            getWithdrawals();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    // Get blocks
    const getBlock = async () => {
        try {
            setLoadingBlock(true);

            const [response, genesisBlock] = await Promise.all([
                axiosClient.get(`/api/slots/${id}`, {
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

            const blockResponse: Block = response.data.block;
            setBlock(blockResponse);
            setBlockGenesis(genesisBlock.data.block_genesis);

            if (!blockResponse) {
                const expectedTimestamp = (genesisBlock.data.block_genesis + id * 12000) / 1000;

                setBlock({
                    f_epoch: Math.floor(id / 32),
                    f_slot: id,
                    f_timestamp: expectedTimestamp,
                });

                setExistsBlock(false);

                const timeDifference = new Date(expectedTimestamp * 1000).getTime() - new Date().getTime();

                if (timeDifference > 2147483647) {
                    return;
                } else if (timeDifference > 0) {
                    setTimeout(() => {
                        if (id === idRef.current) {
                            getBlock();
                        }
                    }, timeDifference + 3000);
                } else if (timeDifference > -10000) {
                    setTimeout(() => {
                        if (id === idRef.current) {
                            getBlock();
                        }
                    }, 1000);
                }
            } else {
                setExistsBlock(true);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingBlock(false);
        }
    };

    // Get withdrawals
    const getWithdrawals = async () => {
        try {
            setLoadingWithdrawals(true);

            const response = await axiosClient.get(`/api/slots/${id}/withdrawals`, {
                params: {
                    network,
                },
            });

            setWithdrawals(response.data.withdrawals);
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingWithdrawals(false);
        }
    };

    // Get Time Block
    const getTimeBlock = () => {
        let text;

        if (block) {
            if (block.f_timestamp) {
                text = new Date(block.f_timestamp * 1000).toLocaleString('ja-JP');
            } else {
                text = new Date(blockGenesis + id * 12000).toLocaleString('ja-JP');
            }
        }

        return text + countdownText;
    };

    //TABS
    const getSelectedTab = () => {
        switch (tabPageIndex) {
            case 0:
                return getOverview();

            case 1:
                return isLargeView ? getWithdrawalsLargeView() : getWithdrawalsSmallView();
        }
    };

    //TABS - Overview & withdrawals
    const getInformationView = () => (
        <div className='flex flex-col w-11/12 xl:w-1/2 mx-auto'>
            <div className='flex flex-col sm:flex-row justify-between items-end w-full gap-4'>
                <div className='flex flex-col sm:flex-row gap-4 w-full'>
                    <TabHeader header='Overview' isSelected={tabPageIndex === 0} onClick={() => setTabPageIndex(0)} />

                    {existsBlock && (
                        <TabHeader
                            header='Withdrawals'
                            isSelected={tabPageIndex === 1}
                            onClick={() => setTabPageIndex(1)}
                        />
                    )}
                </div>

                <ShareMenu type='slot' />
            </div>

            {getSelectedTab()}
        </div>
    );

    //Overview tab - table
    const getOverview = () => (
        <div
            className='rounded-md mt-4 p-8 border-2 border-white text-[var(--black)] dark:text-[var(--white)] bg-[var(--bgMainLightMode)] dark:bg-[var(--bgFairDarkMode)]'
            style={{
                boxShadow: themeMode?.darkMode ? 'var(--boxShadowCardDark)' : 'var(--boxShadowCardLight)',
            }}
        >
            <div className='flex flex-col mx-auto gap-y-5 md:gap-y-8 '>
                <Card title='Epoch' content={<LinkEpoch epoch={block?.f_epoch} />} />

                {block?.f_el_block_number && block?.f_el_block_number > 0 ? (
                    <Card title='Block' content={<LinkBlock block={block?.f_el_block_number} />} />
                ) : (
                    <Card title='Block' text='---' />
                )}

                {existsBlock && <Card title='Entity' content={<LinkEntity entity={block?.f_pool_name} />} />}

                {existsBlock && (
                    <Card title='Proposer' content={<LinkValidator validator={block?.f_proposer_index} />} />
                )}

                {existsBlock && network === 'mainnet' && <Card title='Client' text={block?.f_cl_client || '---'} />}

                {existsBlock && (
                    <Card
                        title='Status'
                        content={
                            block?.f_proposed ? (
                                <span
                                    className='bg-[#53945a] text-white md:w-52 w-40 px-6 text-center py-2 text-[14px] md:text-[16px] rounded-md capitalize font-medium'
                                    style={{ boxShadow: 'var(--boxShadowGreen)' }}
                                >
                                    Proposed
                                </span>
                            ) : (
                                <span
                                    className='bg-[#e86666] text-white md:w-52 w-40 px-6 py-2 text-center text-[14px] md:text-[16px] rounded-md capitalize font-medium'
                                    style={{ boxShadow: 'var(--boxShadowRed)' }}
                                >
                                    Missed
                                </span>
                            )
                        }
                    />
                )}

                <Card title='Time (Local)' text={getTimeBlock()} />

                {existsBlock && <Card title='Graffiti' text={block?.f_proposed ? block?.f_graffiti : '---'} />}

                {existsBlock && (
                    <Card title='Sync bits' text={block?.f_proposed ? block?.f_sync_bits?.toLocaleString() : '---'} />
                )}

                {existsBlock && (
                    <Card
                        title='Attestations'
                        text={block?.f_proposed ? block?.f_attestations?.toLocaleString() : '---'}
                    />
                )}

                {existsBlock && (
                    <Card
                        title='Voluntary exits'
                        text={block?.f_proposed ? block?.f_voluntary_exits?.toLocaleString() : '---'}
                    />
                )}

                {existsBlock && (
                    <Card
                        title='Proposer slashings'
                        text={block?.f_proposed ? block?.f_proposer_slashings?.toLocaleString() : '---'}
                    />
                )}

                {existsBlock && (
                    <Card
                        title='Attestation slashing'
                        text={block?.f_proposed ? block?.f_att_slashings?.toLocaleString() : '---'}
                    />
                )}

                {existsBlock && (
                    <Card title='Deposits' text={block?.f_proposed ? block?.f_deposits?.toLocaleString() : '---'} />
                )}
            </div>
        </div>
    );

    // Withdrawals Large View
    const getWithdrawalsLargeView = () => (
        <LargeTable minWidth={500} fullWidth noRowsText='No Withdrawals' fetchingRows={loadingWithdrawals}>
            <LargeTableHeader text='Validator' />
            <LargeTableHeader text='Address' />
            <LargeTableHeader text='Amount' />

            {withdrawals.map(withdrawal => (
                <LargeTableRow key={withdrawal.f_val_idx}>
                    <div className='w-1/3'>
                        <LinkValidator validator={withdrawal.f_val_idx} mxAuto />
                    </div>

                    <AddressCopy className='w-1/3 justify-center' address={withdrawal.f_address} />

                    <p className='w-1/3'>{(withdrawal.f_amount / 10 ** 9).toLocaleString()} ETH</p>
                </LargeTableRow>
            ))}
        </LargeTable>
    );

    // Withdrawals Small View
    const getWithdrawalsSmallView = () => (
        <SmallTable fullWidth noRowsText='No Withdrawals' fetchingRows={loadingWithdrawals}>
            {withdrawals.map(withdrawal => (
                <SmallTableCard key={withdrawal.f_val_idx}>
                    <div className='flex w-full items-center justify-between'>
                        <p className='font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>Validator</p>
                        <LinkValidator validator={withdrawal.f_val_idx} mxAuto />
                    </div>

                    <div className='flex w-full items-center justify-between'>
                        <p className='font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>Address</p>
                        <AddressCopy address={withdrawal?.f_address} />
                    </div>

                    <div className='flex w-full items-center justify-between'>
                        <p className='font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>Amount</p>
                        <p>{(withdrawal.f_amount / 10 ** 9).toLocaleString()} ETH</p>
                    </div>
                </SmallTableCard>
            ))}
        </SmallTable>
    );

    //OVERVIEW SLOT PAGE
    return (
        <Layout
            title={`Slot ${id} Details - Ethereum Beacon Chain | EthSeer.io`}
            description={`Discover detailed information on Slot ${id} of the Ethereum Beacon Chain, including the block proposer, attestations, and transactions. Dive deeper into blockchain dynamics with EthSeer.io.`}
        >
            <Head>
                <meta name='robots' property='noindex' />
            </Head>

            <TitleWithArrows type='slot' value={id} />

            {loadingBlock && (
                <div className='mt-6'>
                    <Loader />
                </div>
            )}

            {block && !loadingBlock && getInformationView()}
        </Layout>
    );
};

export default Slot;
