import React, { useState, useRef, useContext, useEffect } from 'react';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

// Components
import BlockImage from '../../components/ui/BlockImage';
import LinkValidator from '../../components/ui/LinkValidator';
import LinkSlot from '../../components/ui/LinkSlot';
import LinkEntity from '../../components/ui/LinkEntity';
import BlockState from '../ui/BlockState';

// Types
import { Slot } from '../../types';

// Constants
import { FIRST_BLOCK } from '../../constants';

// Props
type Props = {
    slots: Slot[];
};

const Slots = ({ slots }: Props) => {
    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) ?? {};

    // Refs
    const containerRef = useRef<HTMLInputElement>(null);

    // States
    const [desktopView, setDesktopView] = useState(true);

    useEffect(() => {
        setDesktopView(window !== undefined && window.innerWidth > 768);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

    const getContentSlots = () => {
        const titles = ['Block', 'Entity', 'Proposer', 'Slot', 'Datetime', 'Withdrawals'];
        return (
            <div
                ref={containerRef}
                className='flex flex-col overflow-x-scroll overflow-y-hidden scrollbar-thin my-4'
                onMouseMove={handleMouseMove}
            >
                <div>
                    <div
                        className='font-semibold flex gap-4 py-3 text-center items-center flex-row justify-around md:text-[16px] text-[12px]'
                        style={{
                            color: themeMode?.darkMode ? 'var(--white)' : 'var(--darkGray)',
                        }}
                    >
                        {titles.map((title, index) => (
                            <p key={index} className='w-[20%]'>
                                {title}
                            </p>
                        ))}
                    </div>

                    {slots.map(element => (
                        <div
                            className='flex gap-4 py-3 uppercase text-center items-center flex-row justify-around text-[12px] md:text-[14px] rounded-md border-2 border-white my-2'
                            style={{
                                backgroundColor: themeMode?.darkMode
                                    ? 'var(--bgFairDarkMode)'
                                    : 'var(--bgMainLightMode)',
                                boxShadow: themeMode?.darkMode
                                    ? 'var(--boxShadowCardDark)'
                                    : 'var(--boxShadowCardLight)',
                                color: themeMode?.darkMode ? 'var(--white)' : 'var(--black)',
                            }}
                            key={element.f_proposer_slot}
                        >
                            <div className='flex items-center justify-center w-[20%]'>
                                <BlockState
                                    poolName={element.f_pool_name}
                                    proposed={element.f_proposed}
                                    width={80}
                                    height={80}
                                    showCheck
                                />
                            </div>

                            <div
                                className='w-[20%] font-medium md:hover:underline underline-offset-4 decoration-2'
                                style={{ color: themeMode?.darkMode ? 'var(--purple)' : 'var(--darkPurple)' }}
                            >
                                <LinkEntity entity={element.f_pool_name || 'others'} />
                            </div>

                            <div
                                className='w-[20%] font-medium md:hover:underline underline-offset-4 decoration-2'
                                style={{ color: themeMode?.darkMode ? 'var(--purple)' : 'var(--darkPurple)' }}
                            >
                                <LinkValidator validator={element.f_val_idx} mxAuto />
                            </div>

                            <div
                                className='w-[20%] font-medium md:hover:underline underline-offset-4 decoration-2'
                                style={{ color: themeMode?.darkMode ? 'var(--purple)' : 'var(--darkPurple)' }}
                            >
                                <LinkSlot slot={element.f_proposer_slot} mxAuto />
                            </div>

                            <p className='w-[20%]'>
                                {new Date(FIRST_BLOCK + Number(element.f_proposer_slot) * 12000).toLocaleString(
                                    'ja-JP'
                                )}
                            </p>

                            <p className='w-[20%]'>{(element.withdrawals / 10 ** 9).toLocaleString()} ETH</p>
                        </div>
                    ))}

                    {slots.length === 0 && (
                        <div className='flex justify-center p-2'>
                            <p className='uppercase text-xs md:text-[16px]'>No slots</p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const getContentSlotsMobile = () => {
        return (
            <div
                className='my-6 flex flex-col gap-2 overflow-x-scroll overflow-y-hidden font-medium scrollbar-thin text-[12px]'
                style={{
                    color: themeMode?.darkMode ? 'var(--white)' : 'var(--black)',
                }}
            >
                {slots.map(slot => (
                    <div
                        className='flex flex-row gap-x-10 py-4 items-center justify-center px-2 border-2 border-white rounded-md'
                        key={slot.f_proposer_slot}
                        style={{
                            backgroundColor: themeMode?.darkMode ? 'var(--bgFairDarkMode)' : 'var(--bgMainLightMode)',
                            boxShadow: themeMode?.darkMode ? 'var(--boxShadowCardDark)' : 'var(--boxShadowCardLight)',
                            color: themeMode?.darkMode ? 'var(--white)' : 'var(--black)',
                        }}
                    >
                        <div className='flex items-center '>
                            <BlockState
                                poolName={slot.f_pool_name}
                                proposed={slot.f_proposed}
                                width={80}
                                height={80}
                                showCheck
                            />
                        </div>
                        <div className='flex flex-col items-start'>
                            <div className='flex flex-row items-center gap-x-4'>
                                <p
                                    className='w-24 font-semibold'
                                    style={{
                                        color: themeMode?.darkMode ? 'var(--white)' : 'var(--darkGray)',
                                    }}
                                >
                                    Proposer:
                                </p>
                                <LinkValidator validator={slot.f_val_idx} />
                            </div>

                            <div className='flex flex-row items-center gap-x-4'>
                                <p
                                    className='w-24 font-semibold'
                                    style={{
                                        color: themeMode?.darkMode ? 'var(--white)' : 'var(--darkGray)',
                                    }}
                                >
                                    Slot:
                                </p>
                                <LinkSlot slot={slot.f_proposer_slot} />
                            </div>

                            <div className='flex flex-row items-center gap-x-4'>
                                <p
                                    className='w-24 font-semibold'
                                    style={{
                                        color: themeMode?.darkMode ? 'var(--white)' : 'var(--darkGray)',
                                    }}
                                >
                                    DateTime:
                                </p>
                                <div className='flex flex-col gap-y-0.5'>
                                    <p>
                                        {new Date(
                                            FIRST_BLOCK + Number(slot.f_proposer_slot) * 12000
                                        ).toLocaleDateString('ja-JP', {
                                            year: 'numeric',
                                            month: 'numeric',
                                            day: 'numeric',
                                        })}
                                    </p>
                                    <p>
                                        {new Date(
                                            FIRST_BLOCK + Number(slot.f_proposer_slot) * 12000
                                        ).toLocaleTimeString('ja-JP', {
                                            hour: 'numeric',
                                            minute: 'numeric',
                                            second: 'numeric',
                                        })}
                                    </p>
                                </div>
                            </div>

                            <div className='flex flex-row items-center gap-x-4'>
                                <p
                                    className='w-24 font-semibold'
                                    style={{
                                        color: themeMode?.darkMode ? 'var(--white)' : 'var(--darkGray)',
                                    }}
                                >
                                    Withdrawals:
                                </p>
                                <p>{(slot.withdrawals / 10 ** 9).toLocaleString()} ETH</p>
                            </div>
                        </div>
                    </div>
                ))}

                {slots.length === 0 && (
                    <div className='flex justify-center p-2'>
                        <p className='uppercase text-xs md:text-[16px]'>No slots</p>
                    </div>
                )}
            </div>
        );
    };

    return <div>{desktopView ? getContentSlots() : getContentSlotsMobile()}</div>;
};

export default Slots;
