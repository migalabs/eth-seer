import React from 'react';

// Components
import CustomImage from './CustomImage';

// Helpers
import { getImageUrlEntity, getImageAltEntity } from '../../helpers/imageUrlsHelper';

type Props = {
    poolName: string;
    proposed?: boolean;
    width: number;
    height: number;
    showCheck?: boolean;
};

const BlockState = ({ poolName, proposed = true, width, height, showCheck }: Props) => {
    return (
        <div className='relative'>
            <CustomImage
                src={getImageUrlEntity(poolName)}
                alt={getImageAltEntity(poolName)}
                width={width}
                height={height}
                className={`${proposed ? '' : 'brightness-75'}`}
            />

            {!proposed && (
                <CustomImage
                    className='absolute -bottom-0 -right-5'
                    src={`/static/images/icons/missed_block.webp`}
                    alt='Missed Logo'
                    width={35}
                    height={35}
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

export default BlockState;
