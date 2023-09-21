import React, { useEffect, useContext, useRef } from 'react';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

// Components
import BlockImage from './BlockImage';
import NetworkLink from './NetworkLink';

type Props = {
    index: number;
    pool: string;
};

const EntityCard = ({ index, pool }: Props) => {
    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) ?? {};

    const spanRef = useRef<HTMLSpanElement>(null);

    // useEffect(() => {
    //     if (spanRef.current) {
    //         const spanElement = spanRef.current;
    //         //   const parentElement = spanElement.parentElement as HTMLElement;
    //         const computedFontSize = parseFloat(getComputedStyle(spanElement).width) / pool.length;
    //         const fontSize = Math.min(12, computedFontSize);
    //         spanElement.style.fontSize = `${fontSize}px`;
    //     }
    // }, [pool]);

    return (
        <NetworkLink href={`/entities/${pool.toLocaleLowerCase()}`}>
            <div
                className='flex md:flex-row flex-col bg-[var(--bgFairLightMode)] md:hover:bg-[var(--white)] transition md:justify-start items-center py-4 px-2 border-2 gap-2 rounded-md'
                style={{
                    // backgroundColor: themeMode?.darkMode ? 'var(--bgFairDarkMode)' : 'var(--bgMainLightMode)',
                    boxShadow: themeMode?.darkMode ? 'var(--boxShadowCardDark)' : 'var(--boxShadowCardLight)',
                    color: themeMode?.darkMode ? 'var(--black)' : 'var(--black)',
                    borderColor: themeMode?.darkMode ? 'var(--bgDarkMode)' : 'var(--white)',
                }}
            >
                <div style={{ minWidth: '60px', minHeight: '60px' }}>
                    <BlockImage poolName={pool} width={60} height={60} />
                </div>

                <div className='flex flex-col items-center md:items-start'>
                    <span ref={spanRef} className='text-[14px] md:text-[16px] font-semibold'>
                        {pool}
                    </span>
                    <span className='font-light text-[18px] md:text-[20px]'>{String(index).padStart(3, '0')}</span>
                </div>
            </div>
        </NetworkLink>
    );
};

export default EntityCard;
