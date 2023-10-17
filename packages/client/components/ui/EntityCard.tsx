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

    return (
        <NetworkLink href={`/entities/${pool.toLocaleLowerCase()}`}>
            <div
                className='flex md:flex-row flex-col h-[150px] md:h-[100px] bg-[var(--bgFairLightMode)] md:hover:bg-[var(--white)] transition md:justify-start items-center justify-center py-4 px-2 border-2 gap-2 rounded-md'
                style={{
                    boxShadow: themeMode?.darkMode ? 'var(--boxShadowCardDark)' : 'var(--boxShadowCardLight)',
                    color: themeMode?.darkMode ? 'var(--black)' : 'var(--black)',
                    borderColor: themeMode?.darkMode ? 'var(--bgDarkMode)' : 'var(--white)',
                }}
            >
                <div style={{ minWidth: '60px', minHeight: '60px' }}>
                    <BlockImage poolName={pool} width={60} height={60} />
                </div>

                <div className='flex flex-col items-center md:items-start'>
                    <span
                        className='text-[14px] md:text-[16px] font-semibold uppercase text-center md:text-start'
                        style={{
                            wordWrap: 'break-word',
                            maxWidth: '150px',
                        }}
                    >
                        {pool}
                    </span>
                    <span className='font-light text-[14px] md:text-[16px]'>{String(index).padStart(3, '0')}</span>
                </div>
            </div>
        </NetworkLink>
    );
};

export default EntityCard;
