import React from 'react';

// Components
import CustomImage from './CustomImage';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

// Constants
import { CLIENTS, POOLS } from '../../constants';

type Props = {
    poolName: string;
    clientName?: string;
    proposed?: boolean;
    width: number;
    height: number;
    showCheck?: boolean;
    showClient?: boolean;
};

const BlockImage = ({ poolName, clientName, proposed = true, width, height, showCheck, showClient }: Props) => {
    // Theme Mode Context
    const { themeMode } = React.useContext(ThemeModeContext) ?? {};

    const getUrlEntity = () => {
        if (poolName && POOLS.includes(poolName.toUpperCase())) {
            return `/static/images/blocks/cubes/${poolName.toLowerCase()}.webp`;
        } else if (poolName && poolName.toLowerCase().includes('lido')) {
            return '/static/images/blocks/cubes/lido.webp';
        } else if (poolName && poolName.toLowerCase().includes('whale')) {
            return '/static/images/blocks/cubes/whale-ethereum-entity.webp';
        } else {
            return '/static/images/blocks/cubes/unknown-ethereum-entity.webp';
        }
    };

    const getUrlClient = () => {
        if (clientName && CLIENTS.includes(clientName.toUpperCase())) {
            return `/static/images/blocks/cubes/clients/${clientName.toLowerCase()}.webp`;
        } else {
            return '/static/images/blocks/cubes/unknown-ethereum-entity.webp';
        }
    };

    return (
        <div className='relative'>
            <CustomImage
                src={showClient ? getUrlClient() : getUrlEntity()}
                alt='Logo'
                width={width}
                height={height}
                className={`${proposed ? '' : 'brightness-75'}`}
            />

            {!proposed && (
                <CustomImage
                    className='absolute z-[var(--zIndexBlockImageMissed)] top-0'
                    src={`/static/images/blocks/cubes/missed_block_${themeMode?.darkMode ? 'dark' : 'light'}.webp`}
                    alt='Missed Logo'
                    width={width}
                    height={width}
                />
            )}

            {proposed && showCheck && (
                <CustomImage
                    src='/static/images/icons/proposed_block.webp'
                    alt='Proposed block check'
                    width={35}
                    height={35}
                    className='absolute -bottom-0 -right-5'
                />
            )}
        </div>
    );
};

export default BlockImage;
