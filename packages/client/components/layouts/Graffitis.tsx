import React, { useEffect, useRef, useState, useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

// Axios
import axiosClient from '../../config/axios';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

// Components
import TooltipContainer from '../ui/TooltipContainer';
import CustomImage from '../ui/CustomImage';
import LinkIcon from '../ui/LinkIcon';
import Animation from './Animation';
import Loader from '../ui/Loader';
import TooltipResponsive from '../ui/TooltipResponsive';
import ViewMoreButton from '../ui/ViewMoreButton';

// Types
import { Block } from '../../types';

// Constants
const firstBlock: number = Number(process.env.NEXT_PUBLIC_NETWORK_GENESIS);

const Graffitis = () => {
    // Router
    const router = useRouter();
    const { graffiti } = router.query;

    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) ?? {};

    // Refs
    const containerRef = useRef<HTMLInputElement>(null);

    // States
    const [desktopView, setDesktopView] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [disableViewMore, setDisableViewMore] = useState(true);
    const [animation, setAnimation] = useState(false);
    const [loading, setLoading] = useState(true);
    const [blocks, setBlocks] = useState<Block[]>([]);

    useEffect(() => {
        setDesktopView(window !== undefined && window.innerWidth > 768);

        if (graffiti && blocks.length === 0) {
            getGraffities(0);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [graffiti]);

    const getGraffities = async (page: number, limit: number = 10) => {
        try {
            setLoading(true);

            const response = await axiosClient.get(`/api/slots/graffiti/${graffiti}`, {
                params: {
                    limit,
                    page,
                },
            });
            setBlocks([...blocks, ...response.data.blocks]);
            if (response.data.blocks.length == 0) {
                setAnimation(true);
            }
            if (response.data.blocks.length < limit) {
                setDisableViewMore(true);
            } else {
                setDisableViewMore(false);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
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

    const handleViewMore = () => {
        getGraffities(currentPage + 1);
        setCurrentPage(prevState => prevState + 1);
    };

    const getDesktopView = () => (
        <div
            ref={containerRef}
            className='flex flex-col px-2 xl:px-20 overflow-x-scroll overflow-y-hidden scrollbar-thin pb-4 max-w-[1200px] mx-auto'
            onMouseMove={handleMouseMove}
        >
            <div className='flex gap-x-1 justify-around px-2 xl:px-8 py-3 uppercase text-sm min-w-[700px]'>
                <div className='flex w-[20%] items-center gap-x-1 justify-center'>
                    <p className='mt-0.5'>Time</p>
                    <TooltipContainer>
                        <CustomImage
                            src='/static/images/information.svg'
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
                                    <span>Time at which the slot</span>
                                    <span>should have passed</span>
                                    <span>(calculated since genesis)</span>
                                </>
                            }
                            top='34px'
                        />
                    </TooltipContainer>
                </div>

                <div className='flex w-[20%] items-center gap-x-1 justify-center'>
                    <p className='mt-0.5'>Slot</p>
                    <TooltipContainer>
                        <CustomImage
                            src='/static/images/information.svg'
                            alt='Time information'
                            width={24}
                            height={24}
                        />

                        <TooltipResponsive
                            width={130}
                            backgroundColor='white'
                            colorLetter='black'
                            content={<span>Slot number</span>}
                            top='34px'
                        />
                    </TooltipContainer>
                </div>

                <div className='flex w-[20%] items-center gap-x-1 justify-center'>
                    <p className='mt-0.5'>Validator</p>
                    <TooltipContainer>
                        <CustomImage
                            src='/static/images/information.svg'
                            alt='Blocks information'
                            width={24}
                            height={24}
                        />

                        <TooltipResponsive
                            width={160}
                            backgroundColor='white'
                            colorLetter='black'
                            content={<span>Validator number</span>}
                            top='34px'
                        />
                    </TooltipContainer>
                </div>

                <div className='flex w-[40%] items-center gap-x-1 justify-center'>
                    <p className='mt-0.5'>Graffiti</p>
                    <TooltipContainer>
                        <CustomImage
                            src='/static/images/information.svg'
                            alt='Attestation Accuracy information'
                            width={24}
                            height={24}
                        />

                        <TooltipResponsive
                            width={160}
                            backgroundColor='white'
                            colorLetter='black'
                            content={<span>Graffiti text</span>}
                            top='34px'
                        />
                    </TooltipContainer>
                </div>
            </div>

            <div className='flex flex-col justify-center gap-y-4 min-w-[700px]'>
                {blocks &&
                    blocks.map((block: Block, idx: number) => (
                        <div
                            key={block.f_slot}
                            className='flex gap-x-1 justify-around items-center text-[9px] text-black rounded-[22px] px-2 xl:px-8 py-9'
                            style={{
                                backgroundColor: themeMode?.darkMode ? 'var(--yellow2)' : 'var(--blue1)',
                                boxShadow: themeMode?.darkMode ? 'var(--boxShadowYellow1)' : 'var(--boxShadowBlue1)',
                            }}
                        >
                            <div className='flex flex-col w-[20%]'>
                                <p>{new Date(firstBlock + block.f_slot * 12000).toLocaleDateString('ja-JP')}</p>
                                <p>{new Date(firstBlock + block.f_slot * 12000).toLocaleTimeString('ja-JP')}</p>
                            </div>

                            <div className='w-[20%]'>
                                <Link
                                    href={{
                                        pathname: '/slots/[id]',
                                        query: {
                                            id: block.f_slot,
                                        },
                                    }}
                                    passHref
                                    as={`/slots/${block.f_slot}`}
                                    className='flex gap-x-1 items-center w-fit mx-auto'
                                >
                                    <p>{block?.f_slot?.toLocaleString()}</p>
                                    <LinkIcon />
                                </Link>
                            </div>

                            <div className='w-[20%]'>
                                <Link
                                    href={{
                                        pathname: '/validators/[id]',
                                        query: {
                                            id: block.f_proposer_index,
                                        },
                                    }}
                                    passHref
                                    as={`/validators/${block.f_proposer_index}`}
                                    className='flex gap-x-1 items-center w-fit mx-auto'
                                >
                                    <p>{block.f_proposer_index?.toLocaleString()}</p>
                                    <LinkIcon />
                                </Link>
                            </div>
                            <div className='w-[40%]'>
                                <p>{block.f_graffiti?.toLocaleString()}</p>
                            </div>
                        </div>
                    ))}

                {loading && (
                    <div className='mt-6'>
                        <Loader />
                    </div>
                )}

                {!disableViewMore && <ViewMoreButton onClick={handleViewMore} />}
            </div>
        </div>
    );

    const getPhoneView = () => (
        <div className='flex flex-col gap-y-4 uppercase px-4 mt-3'>
            {blocks &&
                blocks.map((block: Block, idx: number) => (
                    <div
                        key={block.f_slot}
                        className='flex flex-col gap-y-4 justify-around items-center text-[10px] text-black rounded-[22px] px-3 py-7'
                        style={{
                            backgroundColor: themeMode?.darkMode ? 'var(--yellow2)' : 'var(--blue1)',
                            boxShadow: themeMode?.darkMode ? 'var(--boxShadowYellow1)' : 'var(--boxShadowBlue1)',
                        }}
                    >
                        <div className='flex gap-x-1 justify-center'>
                            <Link
                                href={{
                                    pathname: '/slots/[id]',
                                    query: {
                                        id: block.f_slot,
                                    },
                                }}
                                passHref
                                as={`/slots/${block.f_slot}`}
                            >
                                <p className='font-bold text-sm mt-0.5'>Slot {block.f_slot?.toLocaleString()}</p>
                            </Link>
                        </div>
                        <div className='flex flex-col gap-x-4 w-full'>
                            <div className='flex gap-x-1 justify-center mb-1'>
                                <p className='text-xs mt-1'>Time</p>
                                <TooltipContainer>
                                    <CustomImage
                                        src='/static/images/information.svg'
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
                                                <span>Time at which the slot</span>
                                                <span>should have passed</span>
                                                <span>(calculated since genesis)</span>
                                            </>
                                        }
                                        top='34px'
                                    />
                                </TooltipContainer>
                            </div>
                            <div>
                                <p>{new Date(firstBlock + block.f_slot * 12000).toLocaleDateString('ja-JP')}</p>
                                <p>{new Date(firstBlock + block.f_slot * 12000).toLocaleTimeString('ja-JP')}</p>
                            </div>
                        </div>
                        <div className='flex flex-col gap-x-4 w-full'>
                            <div className='flex gap-x-1 justify-center mb-1'>
                                <p className='text-xs mt-1'>Validator</p>
                                <TooltipContainer>
                                    <CustomImage
                                        src='/static/images/information.svg'
                                        alt='Time information'
                                        width={24}
                                        height={24}
                                    />

                                    <TooltipResponsive
                                        width={160}
                                        backgroundColor='white'
                                        colorLetter='black'
                                        content={<span>Validator number</span>}
                                        top='34px'
                                    />
                                </TooltipContainer>
                            </div>
                            <div>
                                <p>{block.f_proposer_index}</p>
                            </div>
                        </div>
                        <div className='flex flex-col gap-x-4 w-full'>
                            <div className='flex gap-x-1 justify-center mb-1'>
                                <p className='text-xs mt-1'>Graffiti</p>
                                <TooltipContainer>
                                    <CustomImage
                                        src='/static/images/information.svg'
                                        alt='Time information'
                                        width={24}
                                        height={24}
                                    />

                                    <TooltipResponsive
                                        width={160}
                                        backgroundColor='white'
                                        colorLetter='black'
                                        content={<span>Graffiti text</span>}
                                        top='34px'
                                    />
                                </TooltipContainer>
                            </div>
                            <div>
                                <p>{block.f_graffiti}</p>
                            </div>
                        </div>
                    </div>
                ))}

            {loading && (
                <div className='mt-6'>
                    <Loader />
                </div>
            )}

            <ViewMoreButton onClick={handleViewMore} />
        </div>
    );

    return (
        <div className='text-center text-white'>
            <h1 className='text-lg md:text-3xl uppercase'>Graffiti &quot;{graffiti}&quot; Search Result</h1>

            <div className='mt-6'>
                {blocks.length === 0 && loading && <Loader />}

                {blocks.length !== 0 && (desktopView ? getDesktopView() : getPhoneView())}

                {animation && <Animation text={`Graffiti "${graffiti}" is not found`} />}
            </div>
        </div>
    );
};

export default Graffitis;
