import { useEffect, useState, useRef, useCallback, useContext } from 'react';
import { useRouter } from 'next/router';

// Axios
import axiosClient from '../../config/axios';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

// Components
import Layout from '../../components/layouts/Layout';
import CustomImage from '../../components/ui/CustomImage';
import LinkIcon from '../../components/ui/LinkIcon';
import BlockGif from '../../components/ui/BlockGif';
import TabHeader from '../../components/ui/TabHeader';
import Loader from '../../components/ui/Loader';
import LinkValidator from '../../components/ui/LinkValidator';
import LinkSlot from '../../components/ui/LinkSlot';
import Arrow from '../../components/ui/Arrow';

// Types
import { Block, Withdrawal } from '../../types';

// Constants
import { FIRST_BLOCK, ADDRESS_ZERO, ADDRESS_ZERO_SHORT } from '../../constants';

type CardProps = {
    title: string;
    content: any;
    icon?: string;
    iconSize?: number;
    link?: string;
    target?: string;
};

const Card = ({ title, content, icon, iconSize, link, target }: CardProps) => {
    return (
        <>
            <div className='flex gap-3 items-center'>
                <p className={`uppercase text-[8px] md:text-[10px] text-black w-28 md:w-[15rem]`}>{title}:</p>
                <div className='flex gap-2 items-center'>
                    <p className='uppercase text-black text-[8px] md:text-[10px]'>{content}</p>
                    {icon && (
                        <a
                            href={link ?? 'none'}
                            target={target}
                            rel='noreferrer'
                            style={{ textDecoration: 'none', color: 'black' }}
                        >
                            {icon === 'link' ? (
                                <LinkIcon />
                            ) : (
                                <CustomImage
                                    src={`/static/images/icons/${icon}.webp`}
                                    width={iconSize ?? 35}
                                    height={iconSize ?? 35}
                                    alt='Icon'
                                    className={link && 'cursor-pointer'}
                                />
                            )}
                        </a>
                    )}
                </div>
            </div>
        </>
    );
};

const Slot = () => {
    // Asset prefix
    const assetPrefix = process.env.NEXT_PUBLIC_ASSET_PREFIX ?? '';

    // Next router
    const router = useRouter();
    const {
        query: { id },
    } = router;

    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) ?? {};

    // Refs
    const slotRef = useRef(0);
    const existsBlockRef = useRef(true);
    const containerRef = useRef<HTMLInputElement>(null);

    // States
    const [block, setBlock] = useState<Block | null>(null);
    const [withdrawals, setWithdrawals] = useState<Array<Withdrawal>>([]);
    const [existsBlock, setExistsBlock] = useState<boolean>(true);
    const [countdownText, setCountdownText] = useState<string>('');
    const [tabPageIndex, setTabPageIndex] = useState<number>(0);
    const [loadingBlock, setLoadingBlock] = useState<boolean>(true);
    const [loadingWithdrawals, setLoadingWithdrawals] = useState<boolean>(true);

    // UseEffect
    useEffect(() => {
        if (id) {
            slotRef.current = Number(id);
        }

        if ((id && !block) || (block && block.f_slot !== Number(id))) {
            getBlock();
            getWithdrawals();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const shuffle = useCallback(() => {
        const text: string = getCountdownText();
        setCountdownText(text);
    }, []);

    useEffect(() => {
        const intervalID = setInterval(shuffle, 1000);
        return () => clearInterval(intervalID);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shuffle, slotRef.current]);

    // Get blocks
    const getBlock = async () => {
        try {
            setLoadingBlock(true);

            const response = await axiosClient.get(`/api/slots/${id}`);

            const blockResponse: Block = response.data.block;
            setBlock(blockResponse);

            if (!blockResponse) {
                const expectedTimestamp = (FIRST_BLOCK + Number(id) * 12000) / 1000;

                setBlock({
                    f_epoch: Math.floor(Number(id) / 32),
                    f_slot: Number(id),
                    f_timestamp: expectedTimestamp,
                });

                setExistsBlock(false);
                existsBlockRef.current = false;

                const timeDifference = new Date(expectedTimestamp * 1000).getTime() - new Date().getTime();

                if (timeDifference > 0) {
                    setTimeout(() => {
                        if (Number(id) === slotRef.current) {
                            getBlock();
                        }
                    }, timeDifference + 2000);
                } else if (timeDifference > -10000) {
                    setTimeout(() => {
                        if (Number(id) === slotRef.current) {
                            getBlock();
                        }
                    }, 1000);
                }
            } else {
                setExistsBlock(true);
                existsBlockRef.current = true;
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

            const response = await axiosClient.get(`/api/slots/${id}/withdrawals`);

            setWithdrawals(response.data.withdrawals);
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingWithdrawals(false);
        }
    };

    // Get Short Address
    const getShortAddress = (address: string | undefined) => {
        return address && `${address.slice(0, 6)}...${address.slice(address.length - 6, address.length)}`;
    };

    const getTimeBlock = () => {
        let text;

        if (block) {
            if (block.f_timestamp) {
                text = new Date(block.f_timestamp * 1000).toLocaleString('ja-JP');
            } else {
                text = new Date(FIRST_BLOCK + Number(id) * 12000).toLocaleString('ja-JP');
            }
        }

        return text + countdownText;
    };

    const getCountdownText = () => {
        let text = '';

        if (!existsBlockRef.current) {
            const expectedTimestamp = (FIRST_BLOCK + slotRef.current * 12000) / 1000;
            const timeDifference = new Date(expectedTimestamp * 1000).getTime() - new Date().getTime();

            const minutesMiliseconds = 1000 * 60;
            const hoursMiliseconds = minutesMiliseconds * 60;
            const daysMiliseconds = hoursMiliseconds * 24;
            const yearsMiliseconds = daysMiliseconds * 365;

            if (timeDifference > yearsMiliseconds) {
                const years = Math.floor(timeDifference / yearsMiliseconds);
                text = ` (in ${years} ${years > 1 ? 'years' : 'year'})`;
            } else if (timeDifference > daysMiliseconds) {
                const days = Math.floor(timeDifference / daysMiliseconds);
                text = ` (in ${days} ${days > 1 ? 'days' : 'day'})`;
            } else if (timeDifference > hoursMiliseconds) {
                const hours = Math.floor(timeDifference / hoursMiliseconds);
                text = ` (in ${hours} ${hours > 1 ? 'hours' : 'hour'})`;
            } else if (timeDifference > minutesMiliseconds) {
                const minutes = Math.floor(timeDifference / minutesMiliseconds);
                text = ` (in ${minutes} ${minutes > 1 ? 'minutes' : 'minute'})`;
            } else if (timeDifference > 1000) {
                const seconds = Math.floor(timeDifference / 1000);
                text = ` (in ${seconds} ${seconds > 1 ? 'seconds' : 'second'})`;
            } else if (timeDifference < -10000) {
                text = ' (data not saved)';
            } else {
                text = ' (updating...)';
            }
        }

        return text;
    };

    const handleMouseMove = (e: any) => {
        if (containerRef.current) {
            const x = e.pageX;
            const limit = 0.15;

            if (x < containerRef.current.clientWidth * limit) {
                containerRef.current.scrollLeft -= 10;
            } else if (x > containerRef.current.clientWidth * (1 - limit)) {
                containerRef.current.scrollLeft += 10;
            }
        }
    };

    const getSelectedTab = () => {
        switch (tabPageIndex) {
            case 0:
                return getConsensusLayerView();

            case 1:
                return getExecutionLayerView();

            case 2:
                return getWithdrawlsView();
        }
    };

    const getInformationView = () => {
        return (
            <div className='flex flex-col px-8 max-w-[1000px] mx-auto'>
                <div className='flex flex-col sm:flex-row gap-4'>
                    <TabHeader
                        header='Consensus Layer'
                        isSelected={tabPageIndex === 0}
                        onClick={() => setTabPageIndex(0)}
                    />
                    {existsBlock && (
                        <>
                            <TabHeader
                                header='Execution Layer'
                                isSelected={tabPageIndex === 1}
                                onClick={() => setTabPageIndex(1)}
                            />
                            <TabHeader
                                header='Withdrawls'
                                isSelected={tabPageIndex === 2}
                                onClick={() => setTabPageIndex(2)}
                            />
                        </>
                    )}
                </div>

                {getSelectedTab()}
            </div>
        );
    };

    const getConsensusLayerView = () => {
        return (
            <div
                className='flex justify-between mb-10 rounded-[22px] mt-4 p-4 md:p-8'
                style={{
                    backgroundColor: themeMode?.darkMode ? 'var(--yellow2)' : 'var(--blue1)',
                    boxShadow: themeMode?.darkMode ? 'var(--boxShadowYellow3)' : 'var(--boxShadowBlue1)',
                }}
            >
                <div className='flex flex-col gap-y-5'>
                    <Card
                        title='Epoch'
                        content={block?.f_epoch?.toLocaleString()}
                        link={`${assetPrefix}/epochs/${block?.f_epoch}`}
                        icon='link'
                        iconSize={25}
                        target='_self'
                    />

                    <Card title='Slot' content={block?.f_slot?.toLocaleString()} />

                    {existsBlock && (
                        <Card
                            title='Entity'
                            content={block?.f_pool_name?.toLocaleString() ?? 'others'}
                            icon='link'
                            iconSize={25}
                            link={`${assetPrefix}/entities/${block?.f_pool_name?.toLocaleString() ?? 'others'}`}
                            target='_self'
                        />
                    )}

                    {existsBlock && (
                        <Card
                            title='Status'
                            content={
                                block?.f_proposed ? (
                                    <span className='uppercase bg-[#83E18C] border-2 border-[#00720B] text-[#00720B] px-5 py-1.5 rounded-2xl font-bold'>
                                        Proposed
                                    </span>
                                ) : (
                                    <span className='uppercase bg-[#FF9090] border-2 border-[#980E0E] text-[#980E0E] px-5 py-1.5 rounded-2xl font-bold'>
                                        Missed
                                    </span>
                                )
                            }
                        />
                    )}

                    <Card title='Date Time (Local)' content={getTimeBlock()} />

                    {existsBlock && (
                        <Card
                            title='Proposer Index'
                            content={block?.f_proposer_index?.toLocaleString()}
                            icon='link'
                            iconSize={25}
                            link={`${assetPrefix}/validators/${block?.f_proposer_index}`}
                            target='_self'
                        />
                    )}

                    {existsBlock && <Card title='Graffiti' content={block?.f_proposed ? block?.f_graffiti : '---'} />}

                    {existsBlock && (
                        <Card
                            title='Sync bits'
                            content={block?.f_proposed ? block?.f_sync_bits?.toLocaleString() : '---'}
                        />
                    )}

                    {existsBlock && (
                        <Card
                            title='Attestations'
                            content={block?.f_proposed ? block?.f_attestations?.toLocaleString() : '---'}
                        />
                    )}

                    {existsBlock && (
                        <Card
                            title='Voluntary exits'
                            content={block?.f_proposed ? block?.f_voluntary_exits?.toLocaleString() : '---'}
                        />
                    )}

                    {existsBlock && (
                        <Card
                            title='Proposer slashings'
                            content={block?.f_proposed ? block?.f_proposer_slashings?.toLocaleString() : '---'}
                        />
                    )}

                    {existsBlock && (
                        <Card
                            title='Attestation Slashing'
                            content={block?.f_proposed ? block?.f_att_slashings?.toLocaleString() : '---'}
                        />
                    )}

                    {existsBlock && (
                        <Card
                            title='Deposits'
                            content={block?.f_proposed ? block?.f_deposits?.toLocaleString() : '---'}
                        />
                    )}
                </div>

                <div className='hidden md:block flex-shrink'>
                    <BlockGif poolName={block?.f_pool_name ?? 'others'} width={150} height={150} />
                </div>
            </div>
        );
    };

    const getExecutionLayerView = () => {
        return (
            <div
                className='flex flex-col mt-4 mb-10 gap-y-5 rounded-[22px] p-4 md:p-8'
                style={{
                    backgroundColor: themeMode?.darkMode ? 'var(--yellow2)' : 'var(--blue1)',
                    boxShadow: themeMode?.darkMode ? 'var(--boxShadowYellow3)' : 'var(--boxShadowBlue1)',
                }}
            >
                <Card
                    title='Block hash'
                    content={
                        block?.f_proposed && block?.f_el_block_hash !== ADDRESS_ZERO
                            ? getShortAddress(block?.f_el_block_hash)
                            : '---'
                    }
                />

                <Card
                    title='Fee Recipient'
                    content={
                        block?.f_proposed && block?.f_el_fee_recp !== ADDRESS_ZERO_SHORT
                            ? getShortAddress(block?.f_el_fee_recp)
                            : '---'
                    }
                />

                <Card title='Gas used' content={block?.f_proposed ? block?.f_el_gas_used?.toLocaleString() : '---'} />

                <Card title='Gas limit' content={block?.f_proposed ? block?.f_el_gas_limit?.toLocaleString() : '---'} />

                <Card
                    title='Transactions'
                    content={block?.f_proposed ? block?.f_el_transactions?.toLocaleString() : '---'}
                />
            </div>
        );
    };

    const getWithdrawlsView = () => {
        return (
            <div
                ref={containerRef}
                className='flex flex-col px-2 mt-2.5 overflow-x-scroll overflow-y-hidden scrollbar-thin'
                onMouseMove={handleMouseMove}
            >
                <div className='flex gap-x-4 justify-around px-4 xl:px-8 min-w-[470px] py-3 uppercase text-sm text-[12px] sm:text-[14px] text-white text-center'>
                    <p className='mt-0.5 w-1/3'>Validator</p>
                    <p className='mt-0.5 w-1/3'>Address</p>
                    <p className='mt-0.5 w-1/3'>Amount</p>
                </div>

                {loadingWithdrawals ? (
                    <div className='mt-6'>
                        <Loader />
                    </div>
                ) : (
                    <div
                        className='flex flex-col gap-y-2 min-w-[470px] leading-5 text-[8px] sm:text-[10px] rounded-[22px] px-4 xl:px-8 py-3'
                        style={{
                            backgroundColor: themeMode?.darkMode ? 'var(--yellow2)' : 'var(--blue1)',
                            boxShadow: themeMode?.darkMode ? 'var(--boxShadowYellow1)' : 'var(--boxShadowBlue1)',
                        }}
                    >
                        {withdrawals.map(element => (
                            <div
                                className='flex gap-x-4 py-1 uppercase text-center items-center'
                                key={element.f_val_idx}
                            >
                                <div className='w-1/3'>
                                    <LinkValidator validator={element.f_val_idx} mxAuto />
                                </div>

                                <div className='w-1/3'>
                                    <p>{getShortAddress(element?.f_address)}</p>
                                </div>

                                <p className='w-1/3'>{(element.f_amount / 10 ** 9).toLocaleString()} ETH</p>
                            </div>
                        ))}

                        {withdrawals.length == 0 && (
                            <div className='flex justify-center p-2'>
                                <p className='uppercase'>No withdrawals</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <Layout>
            <div className='flex gap-x-3 justify-center items-center mt-14 xl:mt-0 mb-5'>
                <LinkSlot slot={Number(id) - 1}>
                    <Arrow direction='left' />
                </LinkSlot>

                <h1 className='text-white text-center text-xl md:text-3xl uppercase'>
                    Slot {Number(id)?.toLocaleString()}
                </h1>

                <LinkSlot slot={Number(id) + 1}>
                    <Arrow direction='right' />
                </LinkSlot>
            </div>

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
