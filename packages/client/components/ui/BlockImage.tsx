import React, { useContext } from 'react';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

// Components
import CustomImage from './CustomImage';

// Helpers
import {
    getImageUrlEntity,
    getImageAltEntity,
    getImageUrlClient,
    getImageAltClient,
} from '../../helpers/imageUrlsHelper';

// Props
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
    const { themeMode } = useContext(ThemeModeContext) ?? {};

    return (
        <div className='relative'>
            <CustomImage
                src={showClient ? getImageUrlClient(clientName) : getImageUrlEntity(poolName)}
                alt={showClient ? getImageAltEntity(clientName) : getImageAltClient(poolName)}
                width={width}
                height={height}
                className={`${proposed ? '' : 'brightness-75'}`}
            />

            {!proposed && (
                <CustomImage
                    className='absolute z-[var(--zIndexBlockImageMissed)] top-0'
                    src={`/static/images/blocks/cubes/missed_block_${themeMode?.darkMode ? 'dark' : 'light'}.webp`}
                    alt='Missed cross'
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
