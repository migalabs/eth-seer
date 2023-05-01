import { useEffect, useState, useRef, useCallback, useContext } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

// Axios
import axiosClient from '../../config/axios';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

// Components
import Layout from '../../components/layouts/Layout';
import CustomImage from '../../components/ui/CustomImage';
import LinkIcon from '../../components/ui/LinkIcon';

// Types
import { Block } from '../../types';

// Constants
import { POOLS } from '../../constants';

const firstBlock: number = Number(process.env.NEXT_PUBLIC_NETWORK_GENESIS);
const zeroAddress = '0x0000000000000000000000000000000000000000000000000000000000000000';
const zeroAddressShort = '0x0000000000000000000000000000000000000000';

type TitleProps = {
    text: string;
    consensusLayer?: boolean;
    darkMode?: boolean;
};

const Title = ({ text, consensusLayer, darkMode }: TitleProps) => {
    let backgroundColor;
    let letterColor;
    let boxShadow;

    if (consensusLayer) {
        backgroundColor = darkMode ? 'var(--green2)' : 'var(--blue3)';
        letterColor = darkMode ? 'var(--green3)' : 'var(--blue7)';
        boxShadow = darkMode ? 'var(--boxShadowGreen3)' : 'var(--boxShadowBlue4)';
    } else {
        backgroundColor = darkMode ? 'var(--orange2)' : 'var(--purple3)';
        letterColor = darkMode ? 'var(--orange3)' : 'var(--purple2)';
        boxShadow = darkMode ? 'var(--boxShadowOrange3)' : 'var(--boxShadowPurple2)';
    }

    return (
        <div className='flex gap-3 items-center'>
            <div
                className='rounded-2xl px-2 py-3 w-60 sm:w-[21rem]'
                style={{
                    boxShadow,
                    backgroundColor,
                }}
            >
                <p className='uppercase text-center text-[12px] sm:text-[14px]' style={{ color: letterColor }}>
                    {text}
                </p>
            </div>
        </div>
    );
};

type CardProps = {
    title: string;
    content: string | number | boolean | any;
    icon?: string;
    iconSize?: number;
    consensusLayer?: boolean;
    link?: string;
    target?: string;
    darkMode?: boolean;
};

const Card = ({ title, content, icon, iconSize, consensusLayer, link, darkMode, target }: CardProps) => {
    let backgroundColor;
    let letterColor;

    if (consensusLayer) {
        backgroundColor = darkMode ? 'var(--green2)' : 'var(--blue3)';
        letterColor = darkMode ? 'var(--green3)' : 'var(--blue7)';
    } else {
        backgroundColor = darkMode ? 'var(--orange2)' : 'var(--purple3)';
        letterColor = darkMode ? 'var(--orange3)' : 'var(--purple2)';
    }

    return (
        <>
            <div className='flex gap-3 items-center'>
                <div
                    className='flex-shrink-0 rounded-2xl px-2 py-3 w-40 md:w-[15rem]'
                    style={{
                        background: backgroundColor,
                    }}
                >
                    <p
                        className={'uppercase text-center text-[10px] md:text-[10px]'}
                        style={{
                            color: letterColor,
                        }}
                    >
                        {title}
                    </p>
                </div>
                <div className='flex gap-2 items-center'>
                    <p className='uppercase text-white text-[8px] md:text-[10px]'>{content}</p>
                    {icon && (
                        <a
                            href={link || 'none'}
                            target={target}
                            rel='noreferrer'
                            style={{ textDecoration: 'none', color: 'black' }}
                        >
                            {icon === 'link' ? (
                                <LinkIcon />
                            ) : (
                                <CustomImage
                                    src={`/static/images/${icon}.svg`}
                                    width={iconSize || 35}
                                    height={iconSize || 35}
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
    const assetPrefix = process.env.NEXT_PUBLIC_ASSET_PREFIX || '';

    // Next router
    const router = useRouter();
    const {
        query: { id },
    } = router;

    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) || {};

    // Refs
    const slotRef = useRef(0);
    const existsBlockRef = useRef(true);

    // States
    const [block, setBlock] = useState<Block | null>(null);
    const [existsBlock, setExistsBlock] = useState<boolean>(true);
    const [countdownText, setCountdownText] = useState<string>('');

    // UseEffect
    useEffect(() => {
        if (id) {
            slotRef.current = Number(id);
        }

        if ((id && !block) || (block && block.f_slot !== Number(id))) {
            getBlock();
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
    }, [shuffle, slotRef.current]);

    // Get blocks
    const getBlock = async () => {
        try {
            const response = await axiosClient.get(`/api/validator-rewards-summary/block/${id}`);

            const blockResponse: Block = response.data.block;
            setBlock(blockResponse);

            if (!blockResponse) {
                const expectedTimestamp = (firstBlock + Number(id) * 12000) / 1000;

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
        }
    };

    // Get Short Address
    const getShortAddress = (address: string | undefined) => {
        return address && `${address.slice(0, 6)}...${address.slice(address.length - 6, address.length)}`;
    };

    const getBlockGif = (block: Block) => {
        if (block.f_pool_name !== undefined) {
            if (block.f_pool_name && POOLS.includes(block.f_pool_name.toUpperCase())) {
                return (
                    <CustomImage
                        src={`/static/gifs/block_${block.f_pool_name.toLowerCase()}.gif`}
                        alt='Logo'
                        width={400}
                        height={400}
                        priority
                    />
                );
            } else if (block.f_pool_name && block.f_pool_name.includes('lido')) {
                return <CustomImage src='/static/gifs/block_lido.gif' alt='Logo' width={400} height={400} priority />;
            } else if (block.f_pool_name && block.f_pool_name.includes('whale')) {
                return <CustomImage src='/static/gifs/block_whale.gif' alt='Logo' width={400} height={400} priority />;
            } else {
                return <CustomImage src='/static/gifs/block_others.gif' alt='Logo' width={400} height={400} priority />;
            }
        }
    };

    const getTimeBlock = () => {
        let text;

        if (block) {
            if (block.f_timestamp) {
                text = new Date(block.f_timestamp * 1000).toLocaleString('ja-JP');
            } else {
                text = new Date(firstBlock + Number(id) * 12000).toLocaleString('ja-JP');
            }
        }

        return text + countdownText;
    };

    const getCountdownText = () => {
        let text = '';

        if (!existsBlockRef.current) {
            const expectedTimestamp = (firstBlock + slotRef.current * 12000) / 1000;
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

    const getInformationView = (block: Block) => {
        return (
            <div className='flex flex-col xl:flex-row xl:gap-5 2xl:gap-28 xl:justify-center max-w-full px-4'>
                <div className='flex flex-col items-center'>
                    <Title text='Consensus Layer' consensusLayer darkMode={themeMode?.darkMode} />

                    <div
                        className='flex flex-col w-full md:w-[650px] 2xl:w-[750px] md:max-h-full md:mx-auto mt-4 mb-10 gap-y-5 rounded-[22px] p-4 md:p-8'
                        style={{
                            backgroundColor: themeMode?.darkMode ? 'var(--green1)' : 'var(--blue4)',
                            boxShadow: themeMode?.darkMode ? 'var(--boxShadowGreen1)' : 'var(--boxShadowBlue3)',
                        }}
                    >
                        <Card
                            title='Epoch'
                            content={block.f_epoch.toLocaleString()}
                            link={`${assetPrefix}/epoch/${block.f_epoch}`}
                            icon='link'
                            iconSize={25}
                            target='_self'
                            consensusLayer
                            darkMode={themeMode?.darkMode}
                        />

                        <Card
                            title='Slot'
                            content={block.f_slot.toLocaleString()}
                            consensusLayer
                            darkMode={themeMode?.darkMode}
                        />

                        {existsBlock && (
                            <Card
                                title='Entity'
                                content={block.f_pool_name?.toLocaleString() || 'others'}
                                consensusLayer
                                darkMode={themeMode?.darkMode}
                            />
                        )}

                        {existsBlock && (
                            <Card
                                title='Status'
                                content={
                                    block.f_proposed ? (
                                        <span className='uppercase bg-[#83E18C] border-2 border-[#00720B] text-[#00720B] px-5 py-1.5 rounded-2xl font-bold'>
                                            Proposed
                                        </span>
                                    ) : (
                                        <span className='uppercase bg-[#FF9090] border-2 border-[#980E0E] text-[#980E0E] px-5 py-1.5 rounded-2xl font-bold'>
                                            Missed
                                        </span>
                                    )
                                }
                                consensusLayer
                                darkMode={themeMode?.darkMode}
                            />
                        )}

                        <Card
                            title='Date Time (Local)'
                            content={getTimeBlock()}
                            consensusLayer
                            darkMode={themeMode?.darkMode}
                        />

                        {existsBlock && (
                            <Card
                                title='Proposer Index'
                                content={block.f_proposer_index?.toLocaleString()}
                                icon='link'
                                iconSize={25}
                                consensusLayer
                                link={`${assetPrefix}/validator/${block.f_proposer_index}`}
                                target='_self'
                                darkMode={themeMode?.darkMode}
                            />
                        )}

                        {existsBlock && (
                            <Card
                                title='Graffiti'
                                content={block.f_proposed ? block.f_graffiti : '---'}
                                consensusLayer
                                darkMode={themeMode?.darkMode}
                            />
                        )}

                        {existsBlock && (
                            <Card
                                title='Sync bits'
                                content={block.f_proposed ? block.f_sync_bits?.toLocaleString() : '---'}
                                consensusLayer
                                darkMode={themeMode?.darkMode}
                            />
                        )}

                        {existsBlock && (
                            <Card
                                title='Attestations'
                                content={block.f_proposed ? block.f_attestations?.toLocaleString() : '---'}
                                consensusLayer
                                darkMode={themeMode?.darkMode}
                            />
                        )}

                        {existsBlock && (
                            <Card
                                title='Voluntary exits'
                                content={block.f_proposed ? block.f_voluntary_exits?.toLocaleString() : '---'}
                                consensusLayer
                                darkMode={themeMode?.darkMode}
                            />
                        )}

                        {existsBlock && (
                            <Card
                                title='Proposer slashings'
                                content={block.f_proposed ? block.f_proposer_slashings?.toLocaleString() : '---'}
                                consensusLayer
                                darkMode={themeMode?.darkMode}
                            />
                        )}

                        {existsBlock && (
                            <Card
                                title='Attestation Slashing'
                                content={block.f_proposed ? block.f_att_slashings?.toLocaleString() : '---'}
                                consensusLayer
                                darkMode={themeMode?.darkMode}
                            />
                        )}

                        {existsBlock && (
                            <Card
                                title='Deposits'
                                content={block.f_proposed ? block.f_deposits?.toLocaleString() : '---'}
                                consensusLayer
                                darkMode={themeMode?.darkMode}
                            />
                        )}
                    </div>
                </div>

                {existsBlock && (
                    <div className='flex flex-col xl:self-end items-center'>
                        <div className='hidden xl:block'>{getBlockGif(block)}</div>

                        <Title text='Execution Layer' darkMode={themeMode?.darkMode} />

                        <div
                            className='flex flex-col xl:self-end w-full md:w-fit h-fit md:max-h-full mx-2 md:mx-auto mt-4 mb-10 gap-y-5 rounded-[22px] p-4 md:p-8'
                            style={{
                                backgroundColor: themeMode?.darkMode ? 'var(--orange4)' : 'var(--purple1)',
                                boxShadow: themeMode?.darkMode ? 'var(--boxShadowOrange2)' : 'var(--boxShadowPurple1)',
                            }}
                        >
                            <Card
                                title='Block hash'
                                content={
                                    block.f_proposed && block.f_el_block_hash !== zeroAddress
                                        ? getShortAddress(block.f_el_block_hash)
                                        : '---'
                                }
                                icon={
                                    block.f_proposed && block.f_el_block_hash !== zeroAddress
                                        ? 'etherscan-icon'
                                        : undefined
                                }
                                iconSize={35}
                                link={`https://etherscan.io/block/${block.f_el_block_hash}`}
                                target='_blank'
                                darkMode={themeMode?.darkMode}
                            />

                            <Card
                                title='Fee Recipient'
                                content={
                                    block.f_proposed && block.f_el_fee_recp !== zeroAddressShort
                                        ? getShortAddress(block.f_el_fee_recp)
                                        : '---'
                                }
                                darkMode={themeMode?.darkMode}
                            />

                            <Card
                                title='Gas used'
                                content={block.f_proposed ? block.f_el_gas_used?.toLocaleString() : '---'}
                                darkMode={themeMode?.darkMode || false}
                            />

                            <Card
                                title='Gas limit'
                                content={block.f_proposed ? block.f_el_gas_limit?.toLocaleString() : '---'}
                                darkMode={themeMode?.darkMode || false}
                            />

                            <Card
                                title='Transactions'
                                content={block.f_proposed ? block.f_el_transactions?.toLocaleString() : '---'}
                                darkMode={themeMode?.darkMode || false}
                            />
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <Layout isMain={false}>
            <div className='flex gap-x-3 justify-center items-center mt-2 mb-5'>
                <Link href={`/slot/${id && Number(id) - 1}`} passHref>
                    <CustomImage
                        src='/static/images/arrow-purple.svg'
                        alt='Left arrow'
                        width={15}
                        height={15}
                        className='mb-1 cursor-pointer'
                    />
                </Link>

                <h1 className='text-white text-center text-xl md:text-3xl uppercase'>
                    Slot {Number(id)?.toLocaleString()}
                </h1>

                <Link href={`/slot/${id && Number(id) + 1}`} passHref>
                    <CustomImage
                        src='/static/images/arrow-purple.svg'
                        alt='Left arrow'
                        width={15}
                        height={15}
                        className='rotate-180 mb-1 cursor-pointer'
                    />
                </Link>
            </div>

            {block && getInformationView(block)}
        </Layout>
    );
};

export default Slot;
