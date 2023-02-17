import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

// Axios
import axiosClient from '../../config/axios';

// Components
import Layout from '../../components/layouts/Layout';

// Types
import { Block } from '../../types';

// Constants
import { POOLS } from '../../constants';

type Props = {
    title: string;
    content: string | number | boolean;
    icon?: string;
    iconSize?: number;
    backgroundColor: string;
    letterColor: string;
    header?: boolean;
    link?: string;
};

const Card = ({ title, content, icon, iconSize, backgroundColor, letterColor, header, link }: Props) => {
    return (
        <div className='flex gap-3 items-center'>
            <div
                className={`bg-[${backgroundColor}] rounded-2xl px-2 py-3 w-40 md:w-[21rem]`}
                style={{
                    boxShadow: header ? `inset -7px -7px 8px ${letterColor}, inset 7px 7px 8px ${letterColor}` : 'none',
                    background: `${backgroundColor}`,
                }}
            >
                <p
                    className={`uppercase text-[${letterColor}] text-center text-[10px] ${
                        header ? 'md:text-[12px]' : 'md:text-[10px]'
                    }`}
                >
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
    );
};

const BlockComponet = () => {
    // Next router
    const router = useRouter();
    const {
        query: { id },
    } = router;

    // States
    const [block, setBlock] = useState<Block | null>(null);
    const [desktopView, setDesktopView] = useState(true);

    // UseEffect
    useEffect(() => {
        if (id && !block) {
            getBlock();
        }

        setDesktopView(window !== undefined && window.innerWidth > 768);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    // Get blocks
    const getBlock = async () => {
        try {
            const response = await axiosClient.get(`/api/validator-rewards-summary/block/${id}`);
            const blockResponse: Block = response.data.block;
            setBlock(blockResponse);
        } catch (error) {
            console.log(error);
        }
    };

    // Get Short Address
    const getShortAddress = (address: string) => {
        return address && `${address.slice(0, 6)}...${address.slice(address.length - 6, address.length)}`;
    };

    const getBlockGif = (block: Block) => {
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
    };

    const getDesktopView = (block: Block) => {
        return (
            <div className='flex flex-col xl:flex-row xl:gap-28 xl:justify-center max-w-full'>
                <div className='flex flex-col items-center'>
                    <Card
                        backgroundColor={'#A7EED4'}
                        letterColor={'#29C68E'}
                        title='Consensus Layer'
                        content={''}
                        header
                    />
                    <div
                        className='flex flex-col w-fit md:max-h-full mx-2 md:mx-auto mt-4 mb-10 gap-y-5 bg-[#A7EED466] rounded-[22px] p-4 md:p-8'
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
                        <Card
                            backgroundColor={'#A7EED4'}
                            letterColor={'#29C68E'}
                            title='Entity'
                            content={block.f_pool_name?.toLocaleString() || 'others'}
                        />
                        <Card
                            backgroundColor={'#A7EED4'}
                            letterColor={'#29C68E'}
                            title='Status'
                            content={block.f_proposed === true ? 'proposed' : 'missed'}
                        />
                        <Card
                            backgroundColor={'#A7EED4'}
                            letterColor={'#29C68E'}
                            title='Timestamp'
                            content={block.f_timestamp}
                        />
                        <Card
                            backgroundColor={'#A7EED4'}
                            letterColor={'#29C68E'}
                            title='Proposer Index'
                            content={block.f_proposer_index.toLocaleString()}
                            icon='beacon-icon'
                            iconSize={35}
                            link={`https://beaconcha.in/validator/${block.f_proposer_index}`}
                        />
                        <Card
                            backgroundColor={'#A7EED4'}
                            letterColor={'#29C68E'}
                            title='Graffiti'
                            content={block.f_graffiti}
                        />
                        <Card
                            backgroundColor={'#A7EED4'}
                            letterColor={'#29C68E'}
                            title='Sync bits'
                            content={block.f_sync_bits?.toLocaleString()}
                        />
                        <Card
                            backgroundColor={'#A7EED4'}
                            letterColor={'#29C68E'}
                            title='Attestations'
                            content={block.f_attestations?.toLocaleString()}
                        />
                        <Card
                            backgroundColor={'#A7EED4'}
                            letterColor={'#29C68E'}
                            title='Voluntary exits'
                            content={block.f_voluntary_exits?.toLocaleString()}
                        />
                        <Card
                            backgroundColor={'#A7EED4'}
                            letterColor={'#29C68E'}
                            title='Proposer slashings'
                            content={block.f_proposer_slashings?.toLocaleString()}
                        />
                        <Card
                            backgroundColor={'#A7EED4'}
                            letterColor={'#29C68E'}
                            title='Att. slashings'
                            content={block.f_att_slashings?.toLocaleString()}
                        />
                        <Card
                            backgroundColor={'#A7EED4'}
                            letterColor={'#29C68E'}
                            title='Deposits'
                            content={block.f_deposits?.toLocaleString()}
                        />
                    </div>
                </div>
                <div className='flex flex-col xl:self-end items-center'>
                    <div className='hidden xl:block'>{getBlockGif(block)}</div>

                    <Card
                        backgroundColor={'#FFCEA1'}
                        letterColor={'#F18D30'}
                        title='Execution Layer'
                        content={''}
                        header
                    />

                    <div
                        className='flex flex-col xl:self-end w-fit h-fit md:max-h-full mx-2 md:mx-auto mt-4 mb-10 gap-y-5 bg-[#FFB16866] rounded-[22px] p-4 md:p-8'
                        style={{ boxShadow: 'inset -7px -7px 8px #FFCEA1, inset 7px 7px 8px #FFCEA1' }}
                    >
                        <Card
                            backgroundColor={'#FFCEA1'}
                            letterColor={'#F18D30'}
                            title='Block hash'
                            content={getShortAddress(block.f_el_block_hash)}
                            icon='etherscan-icon'
                            iconSize={35}
                            link={`https://etherscan.io/block/${block.f_el_block_hash}`}
                        />
                        <Card
                            backgroundColor={'#FFCEA1'}
                            letterColor={'#F18D30'}
                            title='Fee recp.'
                            content={getShortAddress(block.f_el_fee_recp)}
                        />
                        <Card
                            backgroundColor={'#FFCEA1'}
                            letterColor={'#F18D30'}
                            title='Gas used'
                            content={block.f_el_gas_used?.toLocaleString()}
                        />
                        <Card
                            backgroundColor={'#FFCEA1'}
                            letterColor={'#F18D30'}
                            title='Gas limit'
                            content={block.f_el_gas_limit?.toLocaleString()}
                        />
                        <Card
                            backgroundColor={'#FFCEA1'}
                            letterColor={'#F18D30'}
                            title='Transaction'
                            content={block.f_el_transactions?.toLocaleString()}
                        />
                    </div>
                </div>
            </div>
        );
    };

    const getPhoneView = (block: Block) => {
        return (
            <div className='flex flex-col justify-center'>
                <div className='flex flex-col items-center'>
                    <Card
                        backgroundColor={'#A7EED4'}
                        letterColor={'#29C68E'}
                        title='Consensus Layer'
                        content={''}
                        header
                    />
                    <div
                        className='flex flex-col w-fit md:max-h-full mx-2 md:mx-auto mt-4 mb-10 gap-y-5 bg-[#A7EED466] rounded-[22px] p-4 md:p-8'
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
                        <Card
                            backgroundColor={'#A7EED4'}
                            letterColor={'#29C68E'}
                            title='Entity'
                            content={block.f_pool_name?.toLocaleString() || 'others'}
                        />
                        <Card
                            backgroundColor={'#A7EED4'}
                            letterColor={'#29C68E'}
                            title='Status'
                            content={block.f_proposed === true ? 'proposed' : 'missed'}
                        />
                        <Card
                            backgroundColor={'#A7EED4'}
                            letterColor={'#29C68E'}
                            title='Timestamp'
                            content={block.f_timestamp}
                        />
                        <Card
                            backgroundColor={'#A7EED4'}
                            letterColor={'#29C68E'}
                            title='Proposer Index'
                            content={block.f_proposer_index.toLocaleString()}
                            icon='beacon-icon'
                            iconSize={35}
                            link={`https://beaconcha.in/validator/${block.f_proposer_index}`}
                        />
                        <Card
                            backgroundColor={'#A7EED4'}
                            letterColor={'#29C68E'}
                            title='Graffiti'
                            content={block.f_graffiti}
                        />
                        <Card
                            backgroundColor={'#A7EED4'}
                            letterColor={'#29C68E'}
                            title='Sync bits'
                            content={block.f_sync_bits?.toLocaleString()}
                        />
                        <Card
                            backgroundColor={'#A7EED4'}
                            letterColor={'#29C68E'}
                            title='Attestations'
                            content={block.f_attestations?.toLocaleString()}
                        />
                        <Card
                            backgroundColor={'#A7EED4'}
                            letterColor={'#29C68E'}
                            title='Voluntary exits'
                            content={block.f_voluntary_exits?.toLocaleString()}
                        />
                        <Card
                            backgroundColor={'#A7EED4'}
                            letterColor={'#29C68E'}
                            title='Proposer slashings'
                            content={block.f_proposer_slashings?.toLocaleString()}
                        />
                        <Card
                            backgroundColor={'#A7EED4'}
                            letterColor={'#29C68E'}
                            title='Att. slashings'
                            content={block.f_att_slashings?.toLocaleString()}
                        />
                        <Card
                            backgroundColor={'#A7EED4'}
                            letterColor={'#29C68E'}
                            title='Deposits'
                            content={block.f_deposits?.toLocaleString()}
                        />
                    </div>
                </div>
                <div className='flex flex-col self-end items-center'>
                    <Card
                        backgroundColor={'#FFCEA1'}
                        letterColor={'#F18D30'}
                        title='Execution Layer'
                        content={''}
                        header
                    />
                    <div
                        className='flex  flex-col self-end w-fit h-fit md:max-h-full mx-2 md:mx-auto mt-4 mb-10 gap-y-5 bg-[#FFB16866] rounded-[22px] p-4 md:p-8'
                        style={{ boxShadow: 'inset -7px -7px 8px #FFCEA1, inset 7px 7px 8px #FFCEA1' }}
                    >
                        <Card
                            backgroundColor={'#FFCEA1'}
                            letterColor={'#F18D30'}
                            title='Block hash'
                            content={getShortAddress(block.f_el_block_hash)}
                            icon='etherscan-icon'
                            iconSize={35}
                            link={`https://etherscan.io/block/${block.f_el_block_hash}`}
                        />
                        <Card
                            backgroundColor={'#FFCEA1'}
                            letterColor={'#F18D30'}
                            title='Fee recp.'
                            content={getShortAddress(block.f_el_fee_recp)}
                        />
                        <Card
                            backgroundColor={'#FFCEA1'}
                            letterColor={'#F18D30'}
                            title='Gas used'
                            content={block.f_el_gas_used?.toLocaleString()}
                        />
                        <Card
                            backgroundColor={'#FFCEA1'}
                            letterColor={'#F18D30'}
                            title='Gas limit'
                            content={block.f_el_gas_limit?.toLocaleString()}
                        />
                        <Card
                            backgroundColor={'#FFCEA1'}
                            letterColor={'#F18D30'}
                            title='Transaction'
                            content={block.f_el_transactions?.toLocaleString()}
                        />
                    </div>
                </div>
            </div>
        );
    };

    const handleLeftArrowClick = () => {
        router.push(`/slot/${id && Number(id) - 1}`).then(() => {
            router.reload();
        });
    };

    const handleRightArrowClick = () => {
        router.push(`/slot/${id && Number(id) + 1}`).then(() => {
            router.reload();
        });
    };

    return (
        <Layout isMain={false}>
            <div className='flex gap-x-3 justify-center items-center mt-2 mb-5'>
                <Image
                    src='/static/images/arrow-purple.svg'
                    alt='Left arrow'
                    width={15}
                    height={15}
                    className='mb-1 cursor-pointer'
                    onClick={handleLeftArrowClick}
                />

                <h1 className='text-white text-center text-xl md:text-3xl'>Slot {id}</h1>

                <Image
                    src='/static/images/arrow-purple.svg'
                    alt='Left arrow'
                    width={15}
                    height={15}
                    className='rotate-180 mb-1 cursor-pointer'
                    onClick={handleRightArrowClick}
                />
            </div>
            {/* {block && (desktopView ? getDesktopView(block) : getPhoneView(block))} */}
            {block && getDesktopView(block)}
        </Layout>
    );
};

export default BlockComponet;
