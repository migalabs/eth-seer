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
import ValidatorAnimation from '../../components/layouts/ValidatorAnimation';
import LinkIcon from '../../components/ui/LinkIcon';
import BlockImage from '../../components/ui/BlockImage';
import BlockGif from '../../components/ui/BlockGif';
import TabHeader from '../../components/ui/TabHeader';

// Types
import { Validator } from '../../types';
import ProgressSmoothBarEpoch from '../../components/ui/ProgressSmoothBarEpoch';
import ProgressSmoothBar from '../../components/ui/ProgressSmoothBar';

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
    const [desktopView, setDesktopView] = useState(true);
    const [tabPageIndex, setTabPageIndex] = useState(0);

    // UseEffect
    useEffect(() => {
        if (id) {
            validatorRef.current = Number(id);
        }

        if ((id && !validator) || (validator && validator.f_val_idx !== Number(id))) {
            getValidator();
        }

        setDesktopView(window !== undefined && window.innerWidth > 768);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const getValidator = async () => {
        try {
            const response = await axiosClient.get(`/api/validator-rewards-summary/validator/${id}`);

            setValidator(response.data.validator);

            if (response.data.validator.f_val_idx === undefined) {
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

    const getContentProposedBlocksMobile = () => {
        return (
            <Card
                className='mt-5 flex flex-col gap-y-2 mx-2 px-6 uppercase overflow-x-scroll overflow-y-hidden scrollbar-thin text-black text-xl text-[8px] sm:text-[10px]  rounded-[22px] py-3'
                style={{
                    backgroundColor: themeMode?.darkMode ? 'var(--yellow2)' : 'var(--blue1)',
                    boxShadow: themeMode?.darkMode ? 'var(--boxShadowYellow1)' : 'var(--boxShadowBlue1)',
                }}
            >
                {validator?.proposed_blocks?.map(element => (
                    <div className='flex flex-row gap-x-6 py-1 uppercase' key={element.f_proposer_slot}>
                        <div className='flex items-center'>
                            <BlockImage
                                poolName={element.f_pool_name}
                                proposed={element.f_proposed}
                                width={60}
                                height={60}
                                showCheck
                            />
                        </div>
                        <div className='flex flex-col items-start '>
                            <div>
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
                                    <div className='flex flex-row items-center gap-x-8'>
                                        <p className='w-20'>Epoch:</p>
                                        <p className='leading-3'>
                                            <p>{Math.floor(element.f_proposer_slot / 32).toLocaleString()}</p>
                                        </p>
                                    </div>
                                    <LinkIcon />
                                </Link>
                            </div>
                            <div>
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
                                    <div className='flex flex-row items-center gap-x-8'>
                                        <p className='w-20'>Slot:</p>
                                        <p className='leading-3'>{element.f_proposer_slot.toLocaleString()}</p>
                                    </div>
                                    <LinkIcon />
                                </Link>
                            </div>
                            <div className='flex flex-row items-center gap-x-10'>
                                <p className='w-20'>DateTime:</p>
                                <p className='leading-3'>
                                    {new Date(firstBlock + Number(element.f_proposer_slot) * 12000).toLocaleString(
                                        'ja-JP'
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
                {validator?.proposed_blocks.length == 0 && (
                    <div className='flex justify-center p-2'>
                        <p className='uppercase'>No proposed blocks</p>
                    </div>
                )}
            </Card>
        );
    };

    const getContentProposedBlocks = () => {
        return (
            <div
                ref={containerRef}
                className='flex flex-col px-2 mt-2.5 overflow-x-scroll overflow-y-hidden scrollbar-thin'
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
                            <div className='flex items-center justify-center w-[25%]'>
                                <BlockImage
                                    poolName={element.f_pool_name}
                                    proposed={element.f_proposed}
                                    width={60}
                                    height={60}
                                    showCheck
                                />
                            </div>
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
                                    <LinkIcon />
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
                                    <LinkIcon />
                                </Link>
                            </div>
                            <p className='w-[25%]'>
                                {new Date(firstBlock + Number(element.f_proposer_slot) * 12000).toLocaleString('ja-JP')}
                            </p>
                        </div>
                    ))}
                    {validator?.proposed_blocks.length == 0 && (
                        <div className='flex justify-center p-2'>
                            <p className='uppercase'>No proposed blocks</p>
                        </div>
                    )}
                </Card>
            </div>
        );
    };

    const getContentWithdrawals = () => {
        return (
            <div
                ref={containerRef}
                className='flex flex-col px-2 mt-2.5 overflow-x-scroll overflow-y-hidden scrollbar-thin'
                onMouseMove={handleMouseMove}
            >
                <div className='flex gap-x-4 justify-around px-4 xl:px-8 min-w-[700px] py-3 uppercase text-sm text-white text-center'>
                    <p className='mt-0.5 w-[25%]'>Epoch</p>
                    <p className='mt-0.5 w-[25%]'>Slot</p>
                    <p className='mt-0.5 w-[25%]'>Datetime</p>
                    <p className='mt-0.5 w-[25%]'>Amount</p>
                </div>

                <Card
                    className='flex flex-col gap-y-2 min-w-[700px] text-2xs sm:text-xs rounded-[22px] px-4 xl:px-8 py-3'
                    style={{
                        backgroundColor: themeMode?.darkMode ? 'var(--yellow2)' : 'var(--blue1)',
                        boxShadow: themeMode?.darkMode ? 'var(--boxShadowYellow1)' : 'var(--boxShadowBlue1)',
                    }}
                >
                    {validator?.withdrawals?.map((element, idx) => (
                        <div className='flex gap-x-4 py-1 uppercase text-center items-center' key={idx}>
                            <div className='w-[25%]'>
                                <Link
                                    href={{
                                        pathname: '/epoch/[id]',
                                        query: {
                                            id: Math.floor(element.f_epoch ?? 0),
                                        },
                                    }}
                                    passHref
                                    as={`/epoch/${Math.floor(element.f_epoch ?? 0)}`}
                                    className='flex gap-x-1 items-center w-fit mx-auto'
                                >
                                    <p>{Math.floor(element.f_epoch ?? 0).toLocaleString()}</p>
                                    <LinkIcon />
                                </Link>
                            </div>
                            <div className='w-[25%]'>
                                <Link
                                    href={{
                                        pathname: '/slot/[id]',
                                        query: {
                                            id: element.f_slot,
                                        },
                                    }}
                                    passHref
                                    as={`/slot/${element.f_slot}`}
                                    className='flex gap-x-1 items-center w-fit mx-auto'
                                >
                                    <p>{element?.f_slot?.toLocaleString()}</p>
                                    <LinkIcon />
                                </Link>
                            </div>
                            <p className='w-[25%]'>
                                {new Date(firstBlock + Number(element.f_slot) * 12000).toLocaleString('ja-JP')}
                            </p>
                            <p className='w-[25%]'>{(element.f_amount / 10 ** 9).toLocaleString()} ETH</p>
                        </div>
                    ))}
                    {validator?.withdrawals.length == 0 && (
                        <div className='flex justify-center p-2'>
                            <p className='uppercase'>No withdrawals</p>
                        </div>
                    )}
                </Card>
            </div>
        );
    };

    const getContentWithdrawalsMobile = () => {
        return (
            <Card
                className='mt-5 flex flex-col gap-y-2 mx-2 px-6 uppercase overflow-x-scroll overflow-y-hidden scrollbar-thin text-black text-xl text-[8px] sm:text-[10px]  rounded-[22px] py-3'
                style={{
                    backgroundColor: themeMode?.darkMode ? 'var(--yellow2)' : 'var(--blue1)',
                    boxShadow: themeMode?.darkMode ? 'var(--boxShadowYellow1)' : 'var(--boxShadowBlue1)',
                }}
            >
                {validator?.withdrawals?.map(element => (
                    <div className='flex flex-row gap-x-6 py-1 uppercase' key={element.f_val_idx}>
                        <div className='flex flex-col items-start '>
                            <div>
                                <Link
                                    href={{
                                        pathname: '/epoch/[id]',
                                        query: {
                                            id: Math.floor(element.f_epoch ?? 0),
                                        },
                                    }}
                                    passHref
                                    as={`/epoch/${Math.floor(element.f_epoch ?? 0)}`}
                                    className='flex gap-x-1 items-center w-fit mx-auto'
                                >
                                    <div className='flex flex-row items-center gap-x-8'>
                                        <p className='w-20'>Epoch:</p>
                                        <p className='leading-3'>
                                            <p>{Math.floor(element.f_epoch ?? 0).toLocaleString()}</p>
                                        </p>
                                    </div>
                                    <LinkIcon />
                                </Link>
                            </div>
                            <div>
                                <Link
                                    href={{
                                        pathname: '/slot/[id]',
                                        query: {
                                            id: element.f_slot,
                                        },
                                    }}
                                    passHref
                                    as={`/slot/${element.f_slot}`}
                                    className='flex gap-x-1 items-center w-fit mx-auto'
                                >
                                    <div className='flex flex-row items-center gap-x-8'>
                                        <p className='w-20'>Slot:</p>
                                        <p className='leading-3'>{element?.f_slot?.toLocaleString()}</p>
                                    </div>
                                    <LinkIcon />
                                </Link>
                            </div>
                            <div className='flex flex-row items-center gap-x-10'>
                                <p className='w-20'>DateTime:</p>
                                <p className='leading-3'>
                                    {new Date(firstBlock + Number(element.f_slot) * 12000).toLocaleString('ja-JP')}
                                </p>
                            </div>
                            <div className='flex flex-row items-center gap-x-10'>
                                <p className='w-20'>Amount:</p>
                                <p className='leading-3'>{(element.f_amount / 10 ** 9).toLocaleString()} ETH</p>
                            </div>
                        </div>
                    </div>
                ))}
                {validator?.proposed_blocks.length == 0 && (
                    <div className='flex justify-center p-2'>
                        <p className='uppercase'>No proposed blocks</p>
                    </div>
                )}
            </Card>
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
                className='flex mx-2 px-10 py-5 rounded-[22px] justify-between gap-x-5'
                style={{
                    backgroundColor: themeMode?.darkMode ? 'var(--yellow2)' : 'var(--blue1)',
                    boxShadow: themeMode?.darkMode ? 'var(--boxShadowYellow1)' : 'var(--boxShadowBlue1)',
                }}
            >
                <div className='flex flex-col gap-y-2 uppercase text-black text-xl text-[8px] sm:text-[10px]'>
                    <div className='flex flex-row items-center gap-x-5'>
                        <p className='w-60'>Entity:</p>
                        <div>
                            <Link
                                href={{
                                    pathname: '/entity/[name]',
                                    query: {
                                        name: validator?.f_pool_name ? validator.f_pool_name : 'others',
                                    },
                                }}
                                passHref
                                as={`/entity/${validator?.f_pool_name ? validator.f_pool_name : 'others'}`}
                                className='flex gap-x-1 items-center w-fit mx-auto'
                            >
                                <p className='leading-3'>{validator?.f_pool_name ? validator.f_pool_name : 'others'}</p>
                                <LinkIcon />
                            </Link>
                        </div>
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
                    <div className='flex flex-col gap-y-4'>
                        <p className='items-start'>Validator performance:</p>
                        <div className='flex flex-col md:flex-row gap-x-10 gap-y-2 items-center md:justify-end md:w-full ml-10'>
                            <div className='flex flex-col md:flex-row gap-x-3 justify-between w-full md:w-auto flex-grow max-w-[350px] min-w-[200px]'>
                                <p className='w-20'>Rewards</p>
                                <div className='flex-grow mx-6 md:mx-0'>
                                    {validator && (
                                        <ProgressSmoothBarEpoch bg={'#E86506'} color={'#FFC163'} percent={1} />
                                    )}
                                </div>
                            </div>
                            <div className='flex flex-col md:flex-row gap-x-10 gap-y-2'>
                                <div className='md:w-[275px]'>
                                    <CardContent
                                        content={`Agg. Rewards: ${validator?.aggregated_rewards}`}
                                        bg={'#E86506'}
                                        color={'#FFC163'}
                                    />
                                </div>
                                <div className='flex-shrink'>
                                    <CardContent
                                        content={`Max. Rewards: ${validator?.aggregated_max_rewards}`}
                                        bg={'#E86506'}
                                        color={'#FFC163'}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col md:flex-row gap-x-10 gap-y-2 items-center md:w-full ml-10'>
                            <div className='flex flex-col md:flex-row gap-x-3 justify-between w-full md:w-auto flex-grow max-w-[350px] min-w-[200px]'>
                                <p className=''>sync committee participation</p>
                            </div>
                            <div className='flex flex-col md:flex-row gap-x-5 gap-y-2'>
                                <div className='md:w-[240px]'>
                                    <CardContent
                                        content={`Sync commit.: ${validator?.count_missing_source}`}
                                        bg={'#E86506'}
                                        color={'#FFC163'}
                                    />
                                </div>

                                <div className='md:w-[240px]'>
                                    <CardContent
                                        content={`T. Sync commit.: ${validator?.count_missing_source}`}
                                        bg={'#E86506'}
                                        color={'#FFC163'}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col md:flex-row gap-x-10 gap-y-2 items-center md:w-full ml-10'>
                            <div className='flex flex-col md:flex-row gap-x-3 justify-between w-full md:w-auto flex-grow max-w-[350px] min-w-[200px]'>
                                <p className=''>Missing attestation flags</p>
                            </div>
                            <div className='flex flex-col md:flex-row gap-x-4 gap-y-2 text-[9px] text-center leading-3'>
                                <div className='w-32'>
                                    {validator && (
                                        <ProgressSmoothBar
                                            title='Target'
                                            bg='#E86506'
                                            color='#FFC163'
                                            percent={1 - validator.count_missing_target / validator.count_attestations}
                                            tooltipColor='orange'
                                            tooltipContent={
                                                <>
                                                    <span>
                                                        Missing Target:{' '}
                                                        {validator.count_missing_target.toLocaleString()}
                                                    </span>
                                                    <span>
                                                        Attestations: {validator.count_attestations.toLocaleString()}
                                                    </span>
                                                </>
                                            }
                                        />
                                    )}
                                </div>
                                <div className='w-32'>
                                    {validator && (
                                        <ProgressSmoothBar
                                            title='Source'
                                            bg='#14946e'
                                            color='#BDFFEB'
                                            percent={1 - validator.count_missing_source / validator.count_attestations}
                                            tooltipColor='blue'
                                            tooltipContent={
                                                <>
                                                    <span>
                                                        Missing Source:{' '}
                                                        {validator.count_missing_source.toLocaleString()}
                                                    </span>
                                                    <span>
                                                        Attestations: {validator.count_attestations.toLocaleString()}
                                                    </span>
                                                </>
                                            }
                                        />
                                    )}
                                </div>
                                <div className='w-32'>
                                    {validator && (
                                        <ProgressSmoothBar
                                            title='Head'
                                            bg='#532BC5'
                                            color='#E6DDFF'
                                            percent={1 - validator.count_missing_head / validator.count_attestations}
                                            tooltipColor='purple'
                                            tooltipContent={
                                                <>
                                                    <span>
                                                        Missing Head: {validator.count_missing_head.toLocaleString()}
                                                    </span>
                                                    <span>
                                                        Attestations: {validator.count_attestations.toLocaleString()}
                                                    </span>
                                                </>
                                            }
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='hidden md:block'>
                    <BlockGif poolName={validator?.f_pool_name || 'others'} width={150} height={150} />
                </div>
            </Card>
        );
    };

    const getSelectedTab = () => {
        switch (tabPageIndex) {
            case 0:
                return desktopView ? getContentProposedBlocks() : getContentProposedBlocksMobile();

            case 1:
                return desktopView ? getContentWithdrawals() : getContentWithdrawalsMobile();
        }
    };

    return (
        <Layout isMain={false}>
            <div className='flex gap-x-3 justify-center items-center mt-2 mb-5'>
                <h1 className='text-white text-center text-xl md:text-3xl uppercase'>
                    Validator {Number(id)?.toLocaleString()}
                </h1>
            </div>
            {validator?.f_val_idx !== undefined ? (
                <div className='flex flex-col gap-4 mx-auto max-w-[1100px]'>
                    <div>{getContentValidator()}</div>

                    <div className='flex flex-col sm:flex-row gap-4'>
                        <TabHeader header='Blocks' isSelected={tabPageIndex === 0} onClick={() => setTabPageIndex(0)} />
                        <TabHeader
                            header='Withdrawls'
                            isSelected={tabPageIndex === 1}
                            onClick={() => setTabPageIndex(1)}
                        />
                    </div>

                    {getSelectedTab()}
                </div>
            ) : (
                animation && <ValidatorAnimation darkMode={themeMode?.darkMode as boolean} />
            )}
        </Layout>
    );
};

export default ValidatorComponent;
