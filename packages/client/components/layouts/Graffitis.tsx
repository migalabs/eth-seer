import React, { useEffect, useRef, useState, useContext } from 'react';
import { useRouter } from 'next/router';

// Axios
import axiosClient from '../../config/axios';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

// Components
import TooltipContainer from '../ui/TooltipContainer';
import CustomImage from '../ui/CustomImage';
import Animation from './Animation';
import Loader from '../ui/Loader';
import TooltipResponsive from '../ui/TooltipResponsive';
import ViewMoreButton from '../ui/ViewMoreButton';
import LinkValidator from '../ui/LinkValidator';
import LinkSlot from '../ui/LinkSlot';

// Types
import { Block } from '../../types';

// Constants
import { FIRST_BLOCK } from '../../constants';

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
            className='flex flex-col overflow-x-scroll overflow-y-hidden scrollbar-thin pb-4 w-11/12 md:w-10/12 mx-auto'
            onMouseMove={handleMouseMove}
        >
            <div
                className='flex gap-x-1 justify-around xl:px-8 py-3 font-medium md:text-[16px] text-[12px]'
                style={{
                    color: themeMode?.darkMode ? 'var(--white)' : 'var(--darkGray)',
                }}
            >
                <div className='flex w-[20%] items-center gap-x-1 justify-center'>
                    <p className='mt-0.5 font-semibold'>Time</p>
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
                    <p className='mt-0.5 font-semibold'>Slot</p>
                    <TooltipContainer>
                        <CustomImage
                            src='/static/images/icons/information_icon.webp'
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
                    <p className='mt-0.5 font-semibold'>Validator</p>
                    <TooltipContainer>
                        <CustomImage
                            src='/static/images/icons/information_icon.webp'
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
                    <p className='mt-0.5 font-semibold'>Graffiti</p>
                    <TooltipContainer>
                        <CustomImage
                            src='/static/images/icons/information_icon.webp'
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
                            className='flex gap-x-1 justify-around items-center text-xs md:text-[14px] border-2 border-white rounded-md px-2 xl:px-8 py-9'
                            style={{
                                backgroundColor: themeMode?.darkMode
                                    ? 'var(--bgFairDarkMode)'
                                    : 'var(--bgFairLightMode)',
                                boxShadow: themeMode?.darkMode
                                    ? 'var(--boxShadowCardDark)'
                                    : 'var(--boxShadowCardLight)',
                                color: themeMode?.darkMode ? 'var(--white)' : 'var(--black)',
                            }}
                        >
                            <div className='flex flex-col w-[20%] font-medium'>
                                <p>{new Date(FIRST_BLOCK + block.f_slot * 12000).toLocaleDateString('ja-JP')}</p>
                                <p>{new Date(FIRST_BLOCK + block.f_slot * 12000).toLocaleTimeString('ja-JP')}</p>
                            </div>

                            <div
                                className='w-[20%] font-medium md:hover:underline underline-offset-4 decoration-2'
                                style={{ color: themeMode?.darkMode ? 'var(--purple)' : 'var(--darkPurple)' }}
                            >
                                <LinkSlot slot={block.f_slot} mxAuto />
                            </div>

                            <div
                                className='w-[20%] font-medium md:hover:underline underline-offset-4 decoration-2'
                                style={{ color: themeMode?.darkMode ? 'var(--purple)' : 'var(--darkPurple)' }}
                            >
                                <LinkValidator validator={block.f_proposer_index} mxAuto />
                            </div>

                            <div className='w-[40%] font-medium'>
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
                blocks.map((block: Block) => (
                    <div
                        key={block.f_slot}
                        className='flex flex-col gap-y-4 justify-around items-center md:text-[16px] text-[12px] rounded-md px-3 py-7'
                        style={{
                            backgroundColor: themeMode?.darkMode ? 'var(--bgFairDarkMode)' : 'var(--bgFairLightMode)',
                            boxShadow: themeMode?.darkMode ? 'var(--boxShadowCardDark)' : 'var(--boxShadowCardLight)',
                            color: themeMode?.darkMode ? 'var(--white)' : 'var(--black)',
                        }}
                    >
                        <div className='flex gap-x-1 justify-center'>
                            <LinkSlot slot={block.f_slot}>
                                <p className='font-semibold text-sm mt-0.5'>Slot {block.f_slot?.toLocaleString()}</p>
                            </LinkSlot>
                        </div>

                        <div className='flex flex-col gap-x-4 w-full '>
                            <div className='flex gap-x-1 justify-center mb-1'>
                                <p
                                    className='text-xs mt-1 font-semibold'
                                    style={{
                                        color: themeMode?.darkMode ? 'var(--white)' : 'var(--darkGray)',
                                    }}
                                >
                                    Time
                                </p>
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
                                <p>{new Date(FIRST_BLOCK + block.f_slot * 12000).toLocaleDateString('ja-JP')}</p>
                                <p>{new Date(FIRST_BLOCK + block.f_slot * 12000).toLocaleTimeString('ja-JP')}</p>
                            </div>
                        </div>

                        <div className='flex flex-col gap-x-4 w-full'>
                            <div className='flex gap-x-1 justify-center mb-1'>
                                <p
                                    className='text-xs mt-1 font-semibold'
                                    style={{
                                        color: themeMode?.darkMode ? 'var(--white)' : 'var(--darkGray)',
                                    }}
                                >
                                    Validator
                                </p>
                                <TooltipContainer>
                                    <CustomImage
                                        src='/static/images/icons/information_icon.webp'
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
                                <LinkValidator validator={block.f_proposer_index} mxAuto />
                            </div>
                        </div>

                        <div className='flex flex-col gap-x-4 w-full'>
                            <div className='flex gap-x-1 justify-center mb-1'>
                                <p
                                    className='text-xs mt-1 font-semibold'
                                    style={{
                                        color: themeMode?.darkMode ? 'var(--white)' : 'var(--darkGray)',
                                    }}
                                >
                                    Graffiti
                                </p>
                                <TooltipContainer>
                                    <CustomImage
                                        src='/static/images/icons/information_icon.webp'
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

            {animation && <Animation text={`Graffiti "${graffiti}" is not found`} />}
        </div>
    );

    return (
        <div className='text-center text-white'>
            <h1
                className='text-black text-center mt-14 xl:mt-0 font-semibold md:text-[40px] text-[30px] capitalize'
                style={{
                    color: themeMode?.darkMode ? 'var(--white)' : 'var(--black)',
                }}
            >
                Graffiti &quot;{graffiti}&quot; Search Result
            </h1>

            <div className='mt-6'>
                {blocks.length === 0 && loading && <Loader />}

                {blocks.length !== 0 && (desktopView ? getDesktopView() : getPhoneView())}

                {animation && <Animation text={`Graffiti "${graffiti}" is not found`} />}
            </div>
        </div>
    );
};

export default Graffitis;
