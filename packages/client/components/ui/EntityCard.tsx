import React, { useContext } from 'react';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

// Components
import BlockImage from './BlockImage';
import NetworkLink from './NetworkLink';

type Props = {
    activeValidators: number;
    pool: string;
};

function poolRoute(pool: string) {
    const newName = pool.replace(' ', '-').toLocaleLowerCase();
    if (pool !== 'Lido CSM') {
        return '/entities/' + newName;
    }

    return newName;
}

const EntityCard = ({ activeValidators, pool }: Props) => {
    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) ?? {};

    return (
        <NetworkLink href={`${poolRoute(pool)}`}>
            <div
                className='flex md:flex-row flex-col h-[150px] md:h-[100px] bg-[var(--bgFairLightMode)] md:hover:bg-[var(--bgStrongLightMode)] transition md:justify-start items-center justify-center py-4 px-2 border-2 gap-2 rounded-md text-[var(--black)] dark:text-[var(--white)]'
                style={{
                    boxShadow: themeMode?.darkMode ? 'var(--boxShadowCardDark)' : 'var(--boxShadowCardLight)',
                }}
            >
                <div style={{ minWidth: '60px', minHeight: '60px' }}>
                    <BlockImage poolName={pool} width={60} height={60} />
                </div>

                <div className='flex flex-col items-center md:items-start'>
                    <span className='text-[12px] md:text-[16px] font-semibold uppercase text-center md:text-start md:w-[100%] break-all'>
                        {pool}
                    </span>

                    <span className='font-light text-[14px] md:text-[16px]'>
                        {activeValidators.toLocaleString()} A. Validators
                    </span>
                </div>
            </div>
        </NetworkLink>
    );
};

export default EntityCard;
