import React, { useState, useRef, useContext, useEffect } from 'react';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';


// Types
import { BlockEL } from '../../types';

import axiosClient from '../../config/axios';
import { useRouter } from 'next/router';
import LinkBlock from '../ui/LinkBlock';
import LinkSlot from '../ui/LinkSlot';

// Props
type Props = {
    blocks: BlockEL[];
};

const Blocks = ({ blocks }: Props) => {
    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) ?? {};

    // Router
    const router = useRouter();
    const { network } = router.query;

    // Refs
    const containerRef = useRef<HTMLInputElement>(null);

    // States
    const [desktopView, setDesktopView] = useState(true);
    const [blockGenesis, setBlockGenesis] = useState(0);

    useEffect(() => {
        setDesktopView(window !== undefined && window.innerWidth > 768);

        if (network && blockGenesis == 0) {
            getBlockGenesis(network as string);
        }

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

    const getBlockGenesis = async (network: string) => {
        try {
            const genesisBlock = await axiosClient.get(`/api/networks/block/genesis`, {
                params: {
                    network,
                },
            });

            setBlockGenesis(genesisBlock.data.block_genesis);
        } catch (error) {
            console.log(error);
        }
    };

    //View blocks table desktop
    const getContentBlocksDesktop = () => {
        const titles = ['Block Number', 'Slot', 'Datetime', 'Transactions'];
        return (
            <div
                ref={containerRef}
                className='flex flex-col overflow-x-scroll overflow-y-hidden scrollbar-thin my-4'
                onMouseMove={handleMouseMove}
            >
                <div>
                    <div
                        className='font-semibold flex gap-4 py-3 text-center items-center flex-row justify-around text-[16px]'
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

                    {blocks.map(element => (
                        <div
                            className='flex gap-4 py-3 text-center font-medium items-center flex-row justify-around text-[16px] rounded-md border-2 border-white my-2'
                            style={{
                                backgroundColor: themeMode?.darkMode
                                    ? 'var(--bgFairDarkMode)'
                                    : 'var(--bgMainLightMode)',
                                boxShadow: themeMode?.darkMode
                                    ? 'var(--boxShadowCardDark)'
                                    : 'var(--boxShadowCardLight)',
                                color: themeMode?.darkMode ? 'var(--white)' : 'var(--black)',
                            }}
                            key={element.f_slot}
                        >
                            <div
                                className='w-[20%] md:hover:underline underline-offset-4 decoration-2'
                                style={{ color: themeMode?.darkMode ? 'var(--purple)' : 'var(--darkPurple)' }}
                            >
                                <LinkBlock block={element.f_el_block_number} mxAuto />
                            </div>

                            <div
                                className='w-[20%] md:hover:underline underline-offset-4 decoration-2'
                                style={{ color: themeMode?.darkMode ? 'var(--purple)' : 'var(--darkPurple)' }}
                            >
                                <LinkSlot slot={element.f_slot} mxAuto />
                            </div>

                            <p className='w-[20%]'>
                                {new Date(blockGenesis + Number(element.f_slot) * 12000).toLocaleString(
                                    'ja-JP'
                                )}
                            </p>

                            <p className='w-[20%]'>{(element.f_el_transactions ?? 0).toLocaleString()}</p>
                        </div>
                    ))}

                    {blocks.length === 0 && (
                        <div className='flex justify-center p-2'>
                            <p className='uppercase text-[16px]'>No blocks</p>
                        </div>
                    )}
                </div>
            </div>
        );
    };
    //View blocks table mobile
    const getContentBlocksMobile = () => {
        return (
            <div
                className='flex flex-col gap-2 font-medium text-[14px] my-4'
                style={{
                    color: themeMode?.darkMode ? 'var(--white)' : 'var(--black)',
                }}
            >
                {blocks.map(block => (
                    <div
                        className='flex flex-row  py-2 px-2 border-2 border-white rounded-md'
                        style={{
                            backgroundColor: themeMode?.darkMode ? 'var(--bgFairDarkMode)' : 'var(--bgMainLightMode)',
                            boxShadow: themeMode?.darkMode ? 'var(--boxShadowCardDark)' : 'var(--boxShadowCardLight)',
                            color: themeMode?.darkMode ? 'var(--white)' : 'var(--black)',
                        }}
                        key={block.f_slot}
                    >
                        <div className='flex flex-col mx-auto w-10/12'>
                            <div className='flex flex-row items-center justify-between py-1'>
                                <p
                                    className='font-semibold'
                                    style={{
                                        color: themeMode?.darkMode ? 'var(--white)' : 'var(--darkGray)',
                                    }}
                                >
                                    Block number:
                                </p>
                                <LinkBlock block={block.f_el_block_number} />
                            </div>

                            <div className='flex flex-row items-center justify-between py-1'>
                                <p
                                    className='font-semibold'
                                    style={{
                                        color: themeMode?.darkMode ? 'var(--white)' : 'var(--darkGray)',
                                    }}
                                >
                                    Slot:
                                </p>
                                <LinkSlot slot={block.f_slot} />
                            </div>

                            <div className='flex flex-row items-center justify-between py-1'>
                                <p
                                    className='font-semibold'
                                    style={{
                                        color: themeMode?.darkMode ? 'var(--white)' : 'var(--darkGray)',
                                    }}
                                >
                                    Datetime:
                                </p>
                                <div className='flex flex-row gap-2 py-1'>
                                    <p>
                                        {new Date(
                                            blockGenesis + Number(block.f_slot) * 12000
                                        ).toLocaleDateString('ja-JP', {
                                            year: 'numeric',
                                            month: 'numeric',
                                            day: 'numeric',
                                        })}
                                    </p>
                                    <p>
                                        {new Date(
                                            blockGenesis + Number(block.f_slot) * 12000
                                        ).toLocaleTimeString('ja-JP', {
                                            hour: 'numeric',
                                            minute: 'numeric',
                                            second: 'numeric',
                                        })}
                                    </p>
                                </div>
                            </div>

                            <div className='flex flex-row items-center justify-between'>
                                <p
                                    className='font-semibold'
                                    style={{
                                        color: themeMode?.darkMode ? 'var(--white)' : 'var(--darkGray)',
                                    }}
                                >
                                    Transactions:
                                </p>
                                <p>{(block.f_el_transactions ?? 0).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                ))}

                {blocks.length === 0 && (
                    <div className='flex justify-center p-2'>
                        <p className='uppercase text-[14px]'>No blocks</p>
                    </div>
                )}
            </div>
        );
    };

    return <div>{desktopView ? getContentBlocksDesktop() : getContentBlocksMobile()}</div>;
};

export default Blocks;
