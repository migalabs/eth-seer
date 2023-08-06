import React, { useState, useRef, useContext, useEffect } from 'react';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

// Components
import BlockImage from '../../components/ui/BlockImage';
import LinkValidator from '../../components/ui/LinkValidator';
import LinkSlot from '../../components/ui/LinkSlot';
import LinkEntity from '../../components/ui/LinkEntity';

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
        return (
            <div
                ref={containerRef}
                className='flex flex-col px-2 mt-10 overflow-x-scroll overflow-y-hidden scrollbar-thin'
                onMouseMove={handleMouseMove}
            >
                <div className='flex gap-x-4 justify-around px-4 xl:px-8 min-w-[1050px] py-3 uppercase text-sm text-white text-center'>
                    <p className='mt-0.5 w-[7%]'>Block</p>
                    <p className='mt-0.5 w-[32%]'>Entity</p>
                    <p className='mt-0.5 w-[14%]'>Proposer</p>
                    <p className='mt-0.5 w-[15%]'>Slot</p>
                    <p className='mt-0.5 w-[14%]'>DateTime</p>
                    <p className='mt-0.5 w-[18%]'>Withdrawals</p>
                </div>

                <div
                    className='flex flex-col gap-y-2 min-w-[1050px] text-2xs sm:text-xs rounded-[22px] px-4 xl:px-8 py-3'
                    style={{
                        backgroundColor: themeMode?.darkMode ? 'var(--yellow2)' : 'var(--blue1)',
                        boxShadow: themeMode?.darkMode ? 'var(--boxShadowYellow1)' : 'var(--boxShadowBlue1)',
                    }}
                >
                    {slots.map(element => (
                        <div
                            className='flex gap-x-4 py-1 uppercase text-center items-center'
                            key={element.f_proposer_slot}
                        >
                            <div className='flex items-center justify-center w-[7%]'>
                                <BlockImage
                                    poolName={element.f_pool_name}
                                    proposed={element.f_proposed}
                                    width={60}
                                    height={60}
                                    showCheck
                                />
                            </div>

                            <div className='w-[32%]'>
                                <LinkEntity entity={element.f_pool_name || 'others'} />
                            </div>

                            <div className='w-[14%]'>
                                <LinkValidator validator={element.f_val_idx} />
                            </div>

                            <div className='w-[15%]'>
                                <LinkSlot slot={element.f_proposer_slot} mxAuto />
                            </div>

                            <p className='w-[14%]'>
                                {new Date(FIRST_BLOCK + Number(element.f_proposer_slot) * 12000).toLocaleString(
                                    'ja-JP'
                                )}
                            </p>

                            <p className='w-[18%]'>{(element.withdrawals / 10 ** 9).toLocaleString()} ETH</p>
                        </div>
                    ))}

                    {slots.length === 0 && (
                        <div className='flex justify-center p-2'>
                            <p className='uppercase'>No slots</p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const getContentSlotsMobile = () => {
        return (
            <div
                className='mt-5 flex flex-col gap-y-2 mx-2 px-6 uppercase overflow-x-scroll overflow-y-hidden scrollbar-thin text-black text-xl text-[8px] sm:text-[10px]  rounded-[22px] py-3'
                style={{
                    backgroundColor: themeMode?.darkMode ? 'var(--yellow2)' : 'var(--blue1)',
                    boxShadow: themeMode?.darkMode ? 'var(--boxShadowYellow1)' : 'var(--boxShadowBlue1)',
                }}
            >
                {slots.map(slot => (
                    <div className='flex flex-row gap-x-6 py-1 uppercase' key={slot.f_proposer_slot}>
                        <div className='flex items-center'>
                            <BlockImage
                                poolName={slot.f_pool_name}
                                proposed={slot.f_proposed}
                                width={60}
                                height={60}
                                showCheck
                            />
                        </div>
                        <div className='flex flex-col items-start '>
                            <div className='flex flex-row items-center gap-x-8'>
                                <p className='w-24'>Validator:</p>
                                <LinkValidator validator={slot.f_val_idx} />
                            </div>

                            <div className='flex flex-row items-center gap-x-8'>
                                <p className='w-24'>Slot:</p>
                                <LinkSlot slot={slot.f_proposer_slot} />
                            </div>

                            <div className='flex flex-row items-center gap-x-8'>
                                <p className='w-24'>DateTime:</p>
                                <div className='flex flex-col gap-y-0.5'>
                                    <p className='leading-3'>
                                        {new Date(
                                            FIRST_BLOCK + Number(slot.f_proposer_slot) * 12000
                                        ).toLocaleDateString('ja-JP', {
                                            year: 'numeric',
                                            month: 'numeric',
                                            day: 'numeric',
                                        })}
                                    </p>
                                    <p className='leading-3'>
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

                            <div className='flex flex-row items-center gap-x-8'>
                                <p className='w-24'>Withdrawals:</p>
                                <p className='leading-3'>{(slot.withdrawals / 10 ** 9).toLocaleString()} ETH</p>
                            </div>
                        </div>
                    </div>
                ))}

                {slots.length === 0 && (
                    <div className='flex justify-center p-2'>
                        <p className='uppercase'>No slots</p>
                    </div>
                )}
            </div>
        );
    };

    return <div>{desktopView ? getContentSlots() : getContentSlotsMobile()}</div>;
};

export default Slots;
