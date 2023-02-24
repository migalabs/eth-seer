import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';

// Axios
import axiosClient from '../../config/axios';

// Components
import Layout from '../../components/layouts/Layout';

// Types
import { Block } from '../../types';

// Constants
import { POOLS } from '../../constants';
const firstBlock: number = 1606824023000;
const zeroAddress = '0x0000000000000000000000000000000000000000000000000000000000000000';

type TitleProps = {
    text: string;
    backgroundColor: string;
    letterColor: string;
};

const Title = ({ text, backgroundColor, letterColor }: TitleProps) => {
    return (
        <div className='flex gap-3 items-center'>
            <div
                className='rounded-2xl px-2 py-3 w-60 sm:w-[21rem]'
                style={{
                    boxShadow: `inset -7px -7px 8px ${letterColor}, inset 7px 7px 8px ${letterColor}`,
                    background: backgroundColor,
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
    backgroundColor: string;
    letterColor: string;
    link?: string;
};

const Card = ({ title, content, icon, iconSize, backgroundColor, letterColor, link }: CardProps) => {
    return (
        <>
            <div className='flex gap-3 items-center'>
                <div
                    className={`rounded-2xl px-2 py-3 w-40 md:w-[21rem]`}
                    style={{
                        background: `${backgroundColor}`,
                    }}
                >
                    <p className={`uppercase text-[${letterColor}] text-center text-[10px] ${'md:text-[10px]'}`}>
                        {title}
                    </p>
                </div>
                <div className='flex gap-1 items-center'>
                    <p className='uppercase text-white text-[8px] md:text-[10px]'>{content}</p>
                    {icon && (
                        <a
                            href={link || 'none'}
                            target='_blank'
                            rel='noreferrer'
                            style={{ textDecoration: 'none', color: 'black' }}
                        >
                            <Image
                                src={`/static/images/${icon}.svg`}
                                width={iconSize || 35}
                                height={iconSize || 35}
                                alt='Icon'
                                className={link && 'cursor-pointer'}
                            />
                        </a>
                    )}
                </div>
            </div>
        </>
    );
};

const BlockComponet = () => {
    // Next router
    const router = useRouter();
    const {
        query: { id },
    } = router;

    // Refs
    const slotRef = useRef(0);

    // States
    const [block, setBlock] = useState<Block | null>(null);
    const [existsBlock, setExistsBlock] = useState<boolean>(true);

    // UseEffect
    useEffect(() => {
        if ((id && !block) || (block && block.f_slot !== Number(id))) {
            getBlock();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

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

                slotRef.current = Number(id);
                setExistsBlock(false);

                const timeDifference = new Date(expectedTimestamp * 1000).getTime() - new Date().getTime();

                if (timeDifference > 0) {
                    setTimeout(() => {
                        if (Number(id) === slotRef.current) {
                            getBlock();
                        }
                    }, timeDifference + 4000);
                }
            } else {
                setExistsBlock(true);
            }
        } catch (error) {
            console.log(error);
        }
    };

    // Get Short Address
    const getShortAddress = (address: string) => {
        return address && `${address.slice(0, 6)}...${address.slice(address.length - 6, address.length)}`;
    };

    const getBlockGif = (block: Block) => {
        if (block.f_pool_name !== undefined) {
            if (block.f_pool_name && POOLS.includes(block.f_pool_name.toUpperCase())) {
                return (
                    <Image
                        src={`/static/gifs/block_${block.f_pool_name.toLowerCase()}.gif`}
                        alt='Logo'
                        width={400}
                        height={400}
                        priority
                    />
                );
            } else if (block.f_pool_name && block.f_pool_name.includes('lido')) {
                return <Image src={`/static/gifs/block_lido.gif`} alt='Logo' width={400} height={400} priority />;
            } else if (block.f_pool_name && block.f_pool_name.includes('whale')) {
                return <Image src={`/static/gifs/block_whale.gif`} alt='Logo' width={400} height={400} priority />;
            } else {
                return <Image src={`/static/gifs/block_others.gif`} alt='Logo' width={400} height={400} priority />;
            }
        }
    };

    const getInformationView = (block: Block) => {
        return (
            <div className='flex flex-col xl:flex-row xl:gap-28 xl:justify-center max-w-full px-4'>
                <div className='flex flex-col items-center'>
                    <Title backgroundColor={'#A7EED4'} letterColor={'#29C68E'} text='Consensus Layer' />

                    <div
                        className='flex flex-col w-full md:w-[750px] md:max-h-full md:mx-auto mt-4 mb-10 gap-y-5 bg-[#A7EED466] rounded-[22px] p-4 md:p-8'
                        style={{ boxShadow: 'inset -7px -7px 8px #A7EED4, inset 7px 7px 8px #A7EED4' }}
                    >
                        <Card
                            backgroundColor={'#A7EED4'}
                            letterColor={'#29C68E'}
                            title='Epoch'
                            content={block.f_epoch.toLocaleString()}
                        />

                        <Card
                            backgroundColor={'#A7EED4'}
                            letterColor={'#29C68E'}
                            title='Slot'
                            content={block.f_slot.toLocaleString()}
                        />

                        {existsBlock && (
                            <Card
                                backgroundColor={'#A7EED4'}
                                letterColor={'#29C68E'}
                                title='Entity'
                                content={block.f_pool_name?.toLocaleString() || 'others'}
                            />
                        )}

                        {existsBlock && (
                            <Card
                                backgroundColor={'#A7EED4'}
                                letterColor={'#29C68E'}
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
                            />
                        )}

                        <Card
                            backgroundColor={'#A7EED4'}
                            letterColor={'#29C68E'}
                            title='Date (Local)'
                            content={
                                block.f_proposed
                                    ? `${new Date(block.f_timestamp * 1000).toLocaleString()}`
                                    : `${new Date(firstBlock + Number(id) * 12000).toLocaleString()}`
                            }
                        />

                        {existsBlock && (
                            <Card
                                backgroundColor={'#A7EED4'}
                                letterColor={'#29C68E'}
                                title='Proposer Index'
                                content={block.f_proposer_index?.toLocaleString()}
                                icon='beacon-icon'
                                iconSize={35}
                                link={`https://beaconcha.in/validator/${block.f_proposer_index}`}
                            />
                        )}

                        {existsBlock && (
                            <Card
                                backgroundColor={'#A7EED4'}
                                letterColor={'#29C68E'}
                                title='Graffiti'
                                content={block.f_graffiti}
                            />
                        )}

                        {existsBlock && (
                            <Card
                                backgroundColor={'#A7EED4'}
                                letterColor={'#29C68E'}
                                title='Sync bits'
                                content={block.f_proposed ? `${block.f_sync_bits?.toLocaleString()}` : '---'}
                            />
                        )}

                        {existsBlock && (
                            <Card
                                backgroundColor={'#A7EED4'}
                                letterColor={'#29C68E'}
                                title='Attestations'
                                content={block.f_proposed ? `${block.f_attestations?.toLocaleString()}` : '---'}
                            />
                        )}

                        {existsBlock && (
                            <Card
                                backgroundColor={'#A7EED4'}
                                letterColor={'#29C68E'}
                                title='Voluntary exits'
                                content={block.f_proposed ? `${block.f_voluntary_exits?.toLocaleString()}` : '---'}
                            />
                        )}

                        {existsBlock && (
                            <Card
                                backgroundColor={'#A7EED4'}
                                letterColor={'#29C68E'}
                                title='Proposer slashings'
                                content={block.f_proposed ? `${block.f_proposer_slashings?.toLocaleString()}` : '---'}
                            />
                        )}

                        {existsBlock && (
                            <Card
                                backgroundColor={'#A7EED4'}
                                letterColor={'#29C68E'}
                                title='Att. slashings'
                                content={block.f_proposed ? `${block.f_att_slashings?.toLocaleString()}` : '---'}
                            />
                        )}

                        {existsBlock && (
                            <Card
                                backgroundColor={'#A7EED4'}
                                letterColor={'#29C68E'}
                                title='Deposits'
                                content={block.f_proposed ? `${block.f_deposits?.toLocaleString()}` : '---'}
                            />
                        )}
                    </div>
                </div>

                {existsBlock && (
                    <div className='flex flex-col xl:self-end items-center'>
                        <div className='hidden xl:block'>{getBlockGif(block)}</div>

                        <Title backgroundColor='#FFCEA1' letterColor='#F18D30' text='Execution Layer' />

                        <div
                            className='flex flex-col xl:self-end w-full md:w-fit h-fit md:max-h-full mx-2 md:mx-auto mt-4 mb-10 gap-y-5 bg-[#FFB16866] rounded-[22px] p-4 md:p-8'
                            style={{ boxShadow: 'inset -7px -7px 8px #FFCEA1, inset 7px 7px 8px #FFCEA1' }}
                        >
                            <Card
                                backgroundColor={'#FFCEA1'}
                                letterColor={'#F18D30'}
                                title='Block hash'
                                content={block.f_el_block_hash && getShortAddress(block.f_el_block_hash)}
                                icon={block.f_el_block_hash !== zeroAddress ? `etherscan-icon` : undefined}
                                iconSize={35}
                                link={`https://etherscan.io/block/${block.f_el_block_hash}`}
                            />

                            <Card
                                backgroundColor={'#FFCEA1'}
                                letterColor={'#F18D30'}
                                title='Fee recp.'
                                content={block.f_el_fee_recp && getShortAddress(block.f_el_fee_recp)}
                            />

                            <Card
                                backgroundColor={'#FFCEA1'}
                                letterColor={'#F18D30'}
                                title='Gas used'
                                content={block.f_proposed ? `${block.f_el_gas_used?.toLocaleString()}` : '---'}
                            />

                            <Card
                                backgroundColor={'#FFCEA1'}
                                letterColor={'#F18D30'}
                                title='Gas limit'
                                content={block.f_proposed ? `${block.f_el_gas_limit?.toLocaleString()}` : '---'}
                            />

                            <Card
                                backgroundColor={'#FFCEA1'}
                                letterColor={'#F18D30'}
                                title='Transaction'
                                content={block.f_proposed ? `${block.f_el_transactions?.toLocaleString()}` : '---'}
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
                    <Image
                        src='/static/images/arrow-purple.svg'
                        alt='Left arrow'
                        width={15}
                        height={15}
                        className='mb-1 cursor-pointer'
                    />
                </Link>

                <h1 className='text-white text-center text-xl md:text-3xl'>Slot {Number(id)?.toLocaleString()}</h1>

                <Link href={`/slot/${id && Number(id) + 1}`} passHref>
                    <Image
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

export default BlockComponet;
