import React, { useEffect, useState, useRef, useCallback, useContext } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

// Axios
import axiosClient from '../../../config/axios';

// Contexts
import ThemeModeContext from '../../../contexts/theme-mode/ThemeModeContext';

// Components
import Layout from '../../../components/layouts/Layout';
import TabHeader from '../../../components/ui/TabHeader';
import Loader from '../../../components/ui/Loader';
import LinkValidator from '../../../components/ui/LinkValidator';
import LinkSlot from '../../../components/ui/LinkSlot';
import Arrow from '../../../components/ui/Arrow';
import LinkEpoch from '../../../components/ui/LinkEpoch';
import LinkEntity from '../../../components/ui/LinkEntity';
import CustomImage from '../../../components/ui/CustomImage';
import TooltipContainer from '../../../components/ui/TooltipContainer';
import TooltipResponsive from '../../../components/ui/TooltipResponsive';
import ValidatorStatus from '../../../components/ui/ValidatorStatus';
import LinkBlock from '../../../components/ui/LinkBlock';

// Types
import { BlockEL, Transaction, Withdrawal } from '../../../types';

type CardProps = {
    title: string;
    text?: string;
    content?: React.ReactNode;
};

//Card style
const Card = ({ title, text, content }: CardProps) => {
    // Theme Mode Context
    const { themeMode } = React.useContext(ThemeModeContext) ?? {};
    return (
        <>
            <div className='flex flex-row items-center justify-between gap-5 md:gap-20'>
                <p
                    className='text-[14px] md:text-[16px] font-medium'
                    style={{
                        color: themeMode?.darkMode ? 'var(--white)' : 'var(--black)',
                    }}
                >
                    {title}:
                </p>
                <div className='flex gap-2 items-center'>
                    {text && (
                        <p
                            className='uppercase text-[14px] md:text-[16px] font-medium'
                            style={{
                                color: themeMode?.darkMode ? 'var(--white)' : 'var(--black)',
                            }}
                        >
                            {text}
                        </p>
                    )}

                    {content && <>{content}</>}
                </div>
            </div>
        </>
    );
};

const BlockPage = () => {
    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) ?? {};

    // Next router
    const router = useRouter();
    const { network, id } = router.query;

    // Refs
    const slotRef = useRef(0);
    const existsBlockRef = useRef(true);
    const containerRef = useRef<HTMLInputElement>(null);

    // States
    const [block, setBlock] = useState<BlockEL | null>(null);
    const [withdrawals, setWithdrawals] = useState<Array<Withdrawal>>([]);
    const [transactions, setTransactions] = useState<Array<Transaction>>([]);
    const [existsBlock, setExistsBlock] = useState<boolean>(true);
    const [countdownText, setCountdownText] = useState<string>('');
    const [tabPageIndex, setTabPageIndex] = useState<number>(0);
    const [loadingBlock, setLoadingBlock] = useState<boolean>(true);
    const [loadingWithdrawals, setLoadingWithdrawals] = useState<boolean>(true);
    const [loadingTransactions, setLoadingTransactions] = useState<boolean>(true);
    const [desktopView, setDesktopView] = useState(true);
    const [blockGenesis, setBlockGenesis] = useState(0);

    // UseEffect
    useEffect(() => {
        if (id) {
            slotRef.current = Number(id);
        }

        if (network && ((id && !block) || (block && block.f_slot !== Number(id)))) {
            getBlock();
            getTransactions();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [network, id]);
    useEffect(() => {
        setDesktopView(window !== undefined && window.innerWidth > 768);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const shuffle = useCallback(() => {
        const text: string = getCountdownText();
        setCountdownText(text);

        // eslint-disable-next-line react-hooks/exhaustive-deps
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

            const [response, genesisBlock] = await Promise.all([
                axiosClient.get(`/api/blocks/${id}`, {
                    params: {
                        network,
                    },
                }),
                axiosClient.get(`/api/networks/block/genesis`, {
                    params: {
                        network,
                    },
                }),
            ]);

            const blockResponse: BlockEL = response.data.block;
            setBlock(blockResponse);
            setBlockGenesis(genesisBlock.data.block_genesis);

            if (!blockResponse) {
                const expectedTimestamp = (genesisBlock.data.block_genesis + Number(id) * 12000) / 1000;

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

    // Get transactions
    const getTransactions = async () => {
        try {
            setLoadingTransactions(true);

            const response = await axiosClient.get(`/api/blocks/${id}/transactions`, {
                params: {
                    network,
                },
            });

            setTransactions(response.data.transactions);
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingTransactions(false);
        }
    };

    // Get Short Address
    const getShortAddress = (address: string | undefined) => {
        if (typeof address === 'string') {
            return `${address.slice(0, 6)}...${address.slice(address.length - 6, address.length)}`;
        } else {
            return 'Invalid Address';
        }
    };

    // Get Time Block
    const getTimeBlock = () => {
        let text;

        if (block) {
            if (block.f_timestamp) {
                text = new Date(block.f_timestamp * 1000).toLocaleString('ja-JP');
            } else {
                text = new Date(blockGenesis + Number(id) * 12000).toLocaleString('ja-JP');
            }
        }

        return text + countdownText;
    };

    // Get Countdown Text
    const getCountdownText = () => {
        let text = '';

        if (!existsBlockRef.current) {
            const expectedTimestamp = (blockGenesis + slotRef.current * 12000) / 1000;
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

    // Get Handle Mouse
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

    //TABLE
    //TABS
    const getSelectedTab = () => {
        switch (tabPageIndex) {
            case 0:
                return getOverview();

            case 1:
                return desktopView ? getTransactionsDesktop() : getTransactionsMobile();
        }
    };
    //TABS - Overview & withdrawals
    const getInformationView = () => {
        return (
            <div className='flex flex-col mx-auto'>
                <div className='flex flex-col sm:flex-row gap-4 w-1/2 mx-auto'>
                    <TabHeader header='Overview' isSelected={tabPageIndex === 0} onClick={() => setTabPageIndex(0)} />
                    {existsBlock && (
                        <>
                            <TabHeader
                                header='Transactions'
                                isSelected={tabPageIndex === 1}
                                onClick={() => setTabPageIndex(1)}
                            />
                        </>
                    )}
                </div>
                {getSelectedTab()}
            </div>
        );
    };

    //Overview tab - table
    const getOverview = () => {
        return (
            <div
                className='rounded-md mt-4 p-8 w-11/12 md:w-1/2 mx-auto border-2 border-white'
                style={{
                    backgroundColor: themeMode?.darkMode ? 'var(--bgFairDarkMode)' : 'var(--bgMainLightMode)',
                    boxShadow: themeMode?.darkMode ? 'var(--boxShadowCardDark)' : 'var(--boxShadowCardLight)',
                    color: themeMode?.darkMode ? 'var(--white)' : 'var(--black)',
                }}
            >
                {/* Table */}
                <div className='flex flex-col mx-auto gap-y-5 md:gap-y-8 '>
                    <Card title='Block hash' text={getShortAddress(block?.f_el_block_hash)} />
                    <Card title='Slot' content={<LinkSlot slot={block?.f_slot} />} />
                    <Card title='Datetime (Local)' text={getTimeBlock()} />
                    <Card title='Transactions' text={String(block?.f_el_transactions)} />
                    <Card title='Fee recipient' text={getShortAddress(block?.f_el_fee_recp)} />
                    <Card title='Block reward' text={'No data'} />
                    <Card title='Total difficulty' text={'No data'} />
                    <Card title='Size' text={String(block?.f_payload_size_bytes) + ' bytes'} />
                    <Card title='Gas used' text={String(block?.f_el_gas_used)} />
                    <Card title='Gas limit' text={String(block?.f_el_gas_limit)} />
                </div>
            </div>
        );
    };

    const timeSince = (timestamp: number) => {
        const now = new Date();
        const then = new Date(timestamp);
        const diff = now.getTime() - then.getTime();

        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;

        if (hours === 0) {
            return `${remainingMinutes} mins ago`;
        } else {
            return `${hours} hrs ${remainingMinutes} mins ago`;
        }
    };

    //CopyAddress
    const [copied, setCopied] = useState(null);
    useEffect(() => {
        if (copied) {
            setTimeout(() => {
                setCopied(null);
            }, 250);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [copied]);

    const handleCopyClick = async (id: string, text: string) => {
        await navigator.clipboard.writeText(text);
        setCopied(id as any);
    };

    //Transactions tab - table desktop
    const getTransactionsDesktop = () => {
        return (
            <div ref={containerRef} className='flex flex-col w-11/12 mx-auto mt-4' onMouseMove={handleMouseMove}>
                <div
                    className='flex gap-x-4 justify-around px-4 xl:px-8 font-semibold py-3 text-[16px] text-center'
                    style={{
                        color: themeMode?.darkMode ? 'var(--white)' : 'var(--darkGray)',
                    }}
                >
                    <div className='flex items-center gap-x-1 justify-center w-1/3'>
                        <p className='font-semibold'>Txn Hash</p>
                        <TooltipContainer>
                            <CustomImage
                                src='/static/images/icons/information_icon.webp'
                                alt='Time information'
                                width={24}
                                height={24}
                            />

                            <TooltipResponsive
                                width={220}
                                backgroundColor='white'
                                colorLetter='black'
                                content={
                                    <>
                                        <span>
                                            A transaction hash, often denoted as TXN Hash, serves as a distinctive
                                            66-character identifier produced each time a transaction is executed.
                                        </span>
                                    </>
                                }
                                top='34px'
                                polygonLeft
                            />
                        </TooltipContainer>
                    </div>
                    <div className='flex items-center gap-x-1 justify-center w-1/3'>
                        <p className='mt-0.5 font-semibold'>Method</p>
                        <TooltipContainer>
                            <CustomImage
                                src='/static/images/icons/information_icon.webp'
                                alt='Time information'
                                width={24}
                                height={24}
                            />

                            <TooltipResponsive
                                width={220}
                                backgroundColor='white'
                                colorLetter='black'
                                content={
                                    <>
                                        <span>
                                            A function is executed depending on the decoded input data. In cases where
                                            the functions are not recognized, the method ID is presented instead.
                                        </span>
                                    </>
                                }
                                top='34px'
                                polygonLeft
                            />
                        </TooltipContainer>
                    </div>
                    <div className='flex items-center gap-x-1 justify-center w-1/3'>
                        <p className='mt-0.5 font-semibold'>Age</p>
                        <TooltipContainer>
                            <CustomImage
                                src='/static/images/icons/information_icon.webp'
                                alt='Time information'
                                width={24}
                                height={24}
                            />

                            <TooltipResponsive
                                width={220}
                                backgroundColor='white'
                                colorLetter='black'
                                content={
                                    <>
                                        <span>Time has passed since it was created.</span>
                                    </>
                                }
                                top='34px'
                                polygonLeft
                            />
                        </TooltipContainer>
                    </div>
                    <p className='mt-0.5 w-1/3'>From</p>
                    <p className='mt-0.5 w-1/3'>To</p>
                    <div className='flex items-center gap-x-1 justify-center w-1/3'>
                        <p className='mt-0.5 font-semibold'>Value</p>
                    </div>
                    <div className='flex items-center gap-x-1 justify-center w-1/3'>
                        <p className='mt-0.5 font-semibold'>Txn Fee</p>
                        <TooltipContainer>
                            <CustomImage
                                src='/static/images/icons/information_icon.webp'
                                alt='Time information'
                                width={24}
                                height={24}
                            />

                            <TooltipResponsive
                                width={180}
                                backgroundColor='white'
                                colorLetter='black'
                                content={
                                    <>
                                        <span>(Gas price*Gas used by Txns) in Ether</span>
                                    </>
                                }
                                top='34px'
                                polygonLeft
                            />
                        </TooltipContainer>
                    </div>
                </div>

                {loadingTransactions ? (
                    <div className='mt-6'>
                        <Loader />
                    </div>
                ) : (
                    <div className='font-medium flex flex-col gap-y-2 text-[16px]  '>
                        {transactions.map(element => (
                            <div
                                className='flex gap-x-4 uppercase text-center items-center px-4 xl:px-8 py-3 rounded-md border-2 border-white'
                                style={{
                                    backgroundColor: themeMode?.darkMode
                                        ? 'var(--bgFairDarkMode)'
                                        : 'var(--bgMainLightMode)',
                                    boxShadow: themeMode?.darkMode
                                        ? 'var(--boxShadowCardDark)'
                                        : 'var(--boxShadowCardLight)',
                                    color: themeMode?.darkMode ? 'var(--white)' : 'var(--black)',
                                }}
                                key={element.f_hash}
                            >
                                <div
                                    className='flex gap-1 justify-start items-center w-1/3 cursor cursor-pointer'
                                    onClick={() => handleCopyClick(`${element.f_hash}#hash`, element.f_hash)}
                                >
                                    <p
                                        className='md:hover:underline underline-offset-4 decoration-2'
                                        style={{ color: themeMode?.darkMode ? 'var(--purple)' : 'var(--darkPurple)' }}
                                    >
                                        {getShortAddress(element?.f_hash)}
                                    </p>

                                    <CustomImage
                                        src={`/static/images/icons/${
                                            copied == `${element.f_hash}#hash` ? 'copied' : 'copy'
                                        }_${themeMode?.darkMode ? 'dark' : 'light'}.webp`}
                                        alt='Copy icon'
                                        width={20}
                                        height={20}
                                    />
                                </div>

                                <p className='lowercase w-1/3'>{element.f_tx_type}</p>

                                <p className='lowercase w-1/3'>{timeSince(element.f_timestamp * 1000)}</p>

                                <div
                                    className='flex gap-1 justify-center items-center w-1/3 cursor cursor-pointer'
                                    onClick={() => handleCopyClick(`${element.f_hash}#from`, element.f_from)}
                                >
                                    <p
                                        className='md:hover:underline underline-offset-4 decoration-2'
                                        style={{ color: themeMode?.darkMode ? 'var(--purple)' : 'var(--darkPurple)' }}
                                    >
                                        {getShortAddress(element.f_from)}
                                    </p>
                                    <CustomImage
                                        src={`/static/images/icons/${
                                            copied == `${element.f_hash}#from` ? 'copied' : 'copy'
                                        }_${themeMode?.darkMode ? 'dark' : 'light'}.webp`}
                                        alt='Copy icon'
                                        width={20}
                                        height={20}
                                    />
                                </div>
                                <CustomImage
                                    src={`/static/images/icons/send_${themeMode?.darkMode ? 'dark' : 'light'}.webp`}
                                    alt='Send icon'
                                    width={25}
                                    height={25}
                                />
                                <div
                                    className='flex gap-1 justify-center items-center w-1/3 cursor cursor-pointer'
                                    onClick={() => handleCopyClick(`${element.f_hash}#to`, element.f_to)}
                                >
                                    <p
                                        className='md:hover:underline underline-offset-4 decoration-2'
                                        style={{ color: themeMode?.darkMode ? 'var(--purple)' : 'var(--darkPurple)' }}
                                    >
                                        {getShortAddress(element.f_to)}
                                    </p>
                                    <CustomImage
                                        src={`/static/images/icons/${
                                            copied == `${element.f_hash}#to` ? 'copied' : 'copy'
                                        }_${themeMode?.darkMode ? 'dark' : 'light'}.webp`}
                                        alt='Copy icon'
                                        width={20}
                                        height={20}
                                    />
                                </div>
                                <p className='w-1/3'>{(element.f_value / 10 ** 18).toLocaleString()} ETH</p>
                                <p className='w-1/3'>{(element.f_gas_fee_cap / 10 ** 18).toLocaleString()}</p>
                            </div>
                        ))}

                        {transactions.length == 0 && (
                            <div className='flex justify-center p-2'>
                                <p className='uppercase text-[14px] md:text-[16px]'>No transactions</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    //Transactions tab - table mobile
    const getTransactionsMobile = () => {
        return (
            <div
                ref={containerRef}
                className='my-2 flex flex-col gap-2 font-medium text-[12px] w-11/12 mx-auto'
                style={{
                    color: themeMode?.darkMode ? 'var(--white)' : 'var(--black)',
                }}
                onMouseMove={handleMouseMove}
            >
                {loadingTransactions ? (
                    <div className='mt-6'>
                        <Loader />
                    </div>
                ) : (
                    <div>
                        {transactions.map(element => (
                            <div
                                className='flex my-2 flex-col gap-y-2 text-[14px] py-4 px-6 border-2 border-white rounded-md'
                                style={{
                                    backgroundColor: themeMode?.darkMode
                                        ? 'var(--bgFairDarkMode)'
                                        : 'var(--bgMainLightMode)',
                                    boxShadow: themeMode?.darkMode
                                        ? 'var(--boxShadowCardDark)'
                                        : 'var(--boxShadowCardLight)',
                                    color: themeMode?.darkMode ? 'var(--white)' : 'var(--black)',
                                }}
                                key={element.f_hash}
                            >
                                <div className='flex flex-row items-center justify-between'>
                                    <p
                                        className='font-semibold'
                                        style={{
                                            color: themeMode?.darkMode ? 'var(--white)' : 'var(--darkGray)',
                                        }}
                                    >
                                        Txn Hash
                                    </p>
                                    <p>{getShortAddress(element?.f_hash)}</p>
                                </div>
                                <div className='flex flex-row items-center justify-between'>
                                    <p
                                        className='font-semibold'
                                        style={{
                                            color: themeMode?.darkMode ? 'var(--white)' : 'var(--darkGray)',
                                        }}
                                    >
                                        Method
                                    </p>
                                    <p className='lowercase text-right'>{element.f_tx_type}</p>
                                </div>
                                <div className='flex flex-row items-center justify-between'>
                                    <p
                                        className='font-semibold'
                                        style={{
                                            color: themeMode?.darkMode ? 'var(--white)' : 'var(--darkGray)',
                                        }}
                                    >
                                        Age
                                    </p>
                                    <p className='lowercase text-right'>{timeSince(element.f_timestamp * 1000)}</p>
                                </div>
                                <div className='flex flex-row items-center justify-between'>
                                    <p
                                        className='font-semibold'
                                        style={{
                                            color: themeMode?.darkMode ? 'var(--white)' : 'var(--darkGray)',
                                        }}
                                    >
                                        From
                                    </p>

                                    <p>{getShortAddress(element?.f_from)}</p>
                                </div>
                                <div className='flex flex-row items-center justify-between'>
                                    <p
                                        className='font-semibold'
                                        style={{
                                            color: themeMode?.darkMode ? 'var(--white)' : 'var(--darkGray)',
                                        }}
                                    >
                                        To
                                    </p>
                                    <p>{getShortAddress(element?.f_to)}</p>
                                </div>
                                <div className='flex flex-row items-center justify-between'>
                                    <p
                                        className='font-semibold'
                                        style={{
                                            color: themeMode?.darkMode ? 'var(--white)' : 'var(--darkGray)',
                                        }}
                                    >
                                        Value
                                    </p>
                                    <p>{(element.f_value / 10 ** 18).toLocaleString()} ETH</p>
                                </div>
                                <div className='flex flex-row items-center justify-between'>
                                    <p
                                        className='font-semibold'
                                        style={{
                                            color: themeMode?.darkMode ? 'var(--white)' : 'var(--darkGray)',
                                        }}
                                    >
                                        Txn Fee
                                    </p>
                                    <p>{(element.f_gas_fee_cap / 10 ** 18).toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                        {transactions.length == 0 && (
                            <div
                                className='flex mt-2 justify-center rounded-md border-2 border-white px-4 py-4'
                                style={{
                                    backgroundColor: themeMode?.darkMode
                                        ? 'var(--bgFairDarkMode)'
                                        : 'var(--bgMainLightMode)',
                                    boxShadow: themeMode?.darkMode
                                        ? 'var(--boxShadowCardDark)'
                                        : 'var(--boxShadowCardLight)',
                                    color: themeMode?.darkMode ? 'var(--white)' : 'var(--black)',
                                }}
                            >
                                <p className='uppercase text-[14px]'>No transactions</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    //OVERVIEW BLOCK PAGE
    return (
        <Layout>
            <Head>
                <meta name='robots' property='noindex' />
            </Head>

            {/* Header */}
            <div className='flex gap-x-3 justify-center items-center mt-14 xl:mt-0 mb-5'>
                <LinkBlock block={Number(id) - 1}>
                    <Arrow direction='left' />
                </LinkBlock>

                <h1
                    className='text-center font-semibold text-[32px] md:text-[50px]'
                    style={{
                        color: themeMode?.darkMode ? 'var(--white)' : 'var(--black)',
                    }}
                >
                    Block {Number(id)?.toLocaleString()}
                </h1>

                <LinkBlock block={Number(id) + 1}>
                    <Arrow direction='right' />
                </LinkBlock>
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

export default BlockPage;
