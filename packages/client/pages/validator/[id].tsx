import { useContext, useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import Link from 'next/link';
import { useRouter } from 'next/router';

// Axios
import axiosClient from '../../config/axios';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

// Components
import Layout from '../../components/layouts/Layout';
import CustomImage from '../../components/ui/CustomImage';
import ValidatorAnimation from '../../components/layouts/ValidatorAnimation';

// Constants
import { POOLS } from '../../constants';

// Types
import { Slot, Validator } from '../../types';

// Constants
const firstBlock: number = Number(process.env.NEXT_PUBLIC_NETWORK_GENESIS); // 1606824023000

// Styled
const Card = styled.div`
    box-shadow: inset -7px -7px 8px #f0c83a, inset 7px 7px 8px #f0c83a;
`;

type Props = {
    content: string;
    bg: string;
    color: string;
};
const CardContent = ({ content, bg, color }: Props) => {
    return (
        <span
            className='block uppercase border-2 px-5 rounded-2xl font-bold leading-5 py-0.5 sm:py-1'
            style={{ background: color, borderColor: bg, color: bg }}
        >
            {content}
        </span>
    );
};

const ValidatorComponent = () => {
    // Next router
    const router = useRouter();
    const {
        query: { id },
    } = router;

    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) || {};

    // Refs
    const validatorRef = useRef(0);
    const containerRef = useRef<HTMLInputElement>(null);

    const [validator, setValidator] = useState<Validator | null>(null);
    const [animation, setAnimation] = useState(false);

    // UseEffect
    useEffect(() => {
        if (id) {
            validatorRef.current = Number(id);
        }

        if ((id && !validator) || (validator && validator.f_val_idx !== Number(id))) {
            getValidator();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const getValidator = async () => {
        try {
            const response = await axiosClient.get(`/api/validator-rewards-summary/validator/${id}`);

            setValidator(response.data.validator);

            if (response.data.validator.f_val_idx === undefined) {
                console.log("entra?")
                setAnimation(true);
            } else {
                setAnimation(false);
            }
        } catch (error) {
            console.log(error);
            setAnimation(true);
        }
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

    const getBlockImage = (slot: Slot) => {
        const missedExtension = slot.f_proposed ? '' : '_missed';
        if (slot.f_pool_name && POOLS.includes(slot.f_pool_name.toUpperCase())) {
            return (
                <CustomImage
                    src={`/static/images/blocks/block_${slot.f_pool_name.toLowerCase()}${missedExtension}.svg`}
                    alt='Logo'
                    width={60}
                    height={60}
                />
            );
        } else if (slot.f_pool_name && slot.f_pool_name.includes('lido')) {
            return (
                <CustomImage
                    src={`/static/images/blocks/block_lido${missedExtension}.svg`}
                    alt='Logo'
                    width={60}
                    height={60}
                />
            );
        } else if (slot.f_pool_name && slot.f_pool_name.includes('whale')) {
            return (
                <CustomImage
                    src={`/static/images/blocks/block_whale${missedExtension}.svg`}
                    alt='Logo'
                    width={60}
                    height={60}
                />
            );
        } else {
            return (
                <CustomImage
                    src={`/static/images/blocks/block_others${missedExtension}.svg`}
                    alt='Logo'
                    width={60}
                    height={60}
                />
            );
        }
    };

    const getContentProposedBlocks = () => {
        return (
            <div
                ref={containerRef}
                className='flex flex-col px-2 mt-5 overflow-x-scroll overflow-y-hidden scrollbar-thin'
                onMouseMove={handleMouseMove}
            >
                <div className='flex gap-x-4 justify-around px-4 xl:px-8 min-w-[700px] py-3 uppercase text-sm text-white text-center'>
                    <p className='mt-0.5 w-[25%]'>Block</p>
                    <p className='mt-0.5 w-[25%]'>Epoch</p>
                    <p className='mt-0.5 w-[25%]'>Slot</p>
                    <p className='mt-0.5 w-[25%]'>Datetime</p>
                </div>

                <Card
                    className='flex flex-col gap-y-2 min-w-[700px] text-2xs sm:text-xs rounded-[22px] px-4 xl:px-8 py-3'
                    style={{
                        backgroundColor: themeMode?.darkMode ? 'var(--yellow2)' : 'var(--blue1)',
                        boxShadow: themeMode?.darkMode ? 'var(--boxShadowYellow1)' : 'var(--boxShadowBlue1)',
                    }}
                >
                    {validator?.proposed_blocks?.map(element => (
                        <div
                            className='flex gap-x-4 py-1 uppercase text-center items-center'
                            key={element.f_proposer_slot}
                        >
                            <div className='flex items-center justify-center w-[25%]'>{getBlockImage(element)}</div>
                            <div className='w-[25%]'>
                                <Link
                                    href={{
                                        pathname: '/epoch/[id]',
                                        query: {
                                            id: Math.floor(element.f_proposer_slot / 32),
                                        },
                                    }}
                                    passHref
                                    as={`/epoch/${Math.floor(element.f_proposer_slot / 32)}`}
                                    className='flex gap-x-1 items-center w-fit mx-auto'
                                >
                                    <p>{Math.floor(element.f_proposer_slot / 32).toLocaleString()}</p>
                                    <CustomImage
                                        src='/static/images/link.svg'
                                        alt='Link icon'
                                        width={20}
                                        height={20}
                                        className='mb-1'
                                    />
                                </Link>
                            </div>
                            <div className='w-[25%]'>
                                <Link
                                    href={{
                                        pathname: '/slot/[id]',
                                        query: {
                                            id: element.f_proposer_slot,
                                        },
                                    }}
                                    passHref
                                    as={`/slot/${element.f_proposer_slot}`}
                                    className='flex gap-x-1 items-center w-fit mx-auto'
                                >
                                    <p>{element.f_proposer_slot.toLocaleString()}</p>
                                    <CustomImage
                                        src='/static/images/link.svg'
                                        alt='Link icon'
                                        width={20}
                                        height={20}
                                        className='mb-1'
                                    />
                                </Link>
                            </div>
                            <p className='w-[25%]'>
                                {new Date(firstBlock + Number(element.f_proposer_slot) * 12000).toLocaleString('ja-JP')}
                            </p>
                        </div>
                    ))}
                </Card>
            </div>
        );
    };

    const getCurrentStatus = (status: string) => {
        if (status === 'active') {
            return <CardContent content={status} bg='#00720B' color='#83E18C' />;
        } else if (status === 'slashed') {
            return <CardContent content={status} bg='#980E0E' color='#FF9090' />;
        } else if (status === 'exit') {
            return <CardContent content='exited' bg='#0016D8' color='#BDC4FF' />;
        } else if (status === 'in queue to activation') {
            return <CardContent content='deposited' bg='#E86506' color='#FFC163' />;
        }
    };

    const getContentValidator = () => {
        return (
            <Card
                className='flex flex-col gap-y-2 mx-2 px-6 uppercase overflow-x-scroll overflow-y-hidden scrollbar-thin text-black text-xl text-[8px] sm:text-[10px]  rounded-[22px] py-3'
                style={{
                    backgroundColor: themeMode?.darkMode ? 'var(--yellow2)' : 'var(--blue1)',
                    boxShadow: themeMode?.darkMode ? 'var(--boxShadowYellow1)' : 'var(--boxShadowBlue1)',
                }}
            >
                <div className='flex flex-row items-center gap-x-5'>
                    <p className='w-60'>Entity:</p>
                    <p className='leading-3'>{validator?.f_pool_name !== null ? validator?.f_pool_name : 'others'}</p>
                </div>
                <div className='flex flex-row items-center gap-x-5'>
                    <p className='w-60'>Current balance:</p>
                    <p className='leading-3'>{validator?.f_balance_eth}</p>
                </div>
                <div className='flex flex-col sm:flex-row gap-x-5'>
                    <p className='w-60'>Current status:</p>
                    <div className='flex justify-center gap-x-4 '>
                        {validator?.f_status && getCurrentStatus(validator?.f_status)}
                    </div>
                </div>
            </Card>
        );
    };

    return (
        <Layout isMain={false}>
            <div className='flex gap-x-3 justify-center items-center mt-2 mb-5'>
                <h1 className='text-white text-center text-xl md:text-3xl uppercase'>
                    Validator {Number(id)?.toLocaleString()}
                </h1>
            </div>
            {validator?.f_val_idx !== undefined ? (
                <div className='mx-auto max-w-[1100px]'>
                    <div>{getContentValidator()}</div>
                    {validator?.proposed_blocks && validator?.proposed_blocks.length > 0 && (
                        <>
                        <div className='flex gap-x-3 justify-center items-center mt-6'>
                            <h1 className='text-white text-center text-lg md:text-2xl uppercase'>
                                Proposed Blocks
                            </h1>
                        </div>
                        <div>{getContentProposedBlocks()}</div>
                        </>
                    )}
                </div>
            ) : (
                animation && <ValidatorAnimation darkMode={themeMode?.darkMode as boolean} />
            )}
        </Layout>
    );
};

export default ValidatorComponent;
