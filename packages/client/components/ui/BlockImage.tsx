import React from 'react';

// Components
import CustomImage from './CustomImage';

// Types
import { Slot } from '../../types';

// Constants
import { POOLS } from '../../constants';

type Props = {
    poolName: string;
    proposed?: boolean;
    width: number;
    height: number;
    showCheck?: boolean;
};

const BlockImage = ({ poolName, proposed = true, width, height, showCheck }: Props) => {
    const getUrl = () => {
        if (poolName && POOLS.includes(poolName.toUpperCase())) {
            return `/static/images/blocks/cubes/${poolName}.webp`;
        } else if (poolName && poolName.includes('lido')) {
            return `/static/images/blocks/cubes/lido.webp`;
        } else if (poolName && poolName.includes('whale')) {
            return `/static/images/blocks/cubes/whale-ethereum-entity.webp`;
        } else {
            return `/static/images/blocks/cubes/unknown-ethereum-entity.webp`;
        }
    };

    return (
        <div className='relative'>
            <CustomImage
                src={getUrl()}
                alt='Logo'
                width={width}
                height={height}
                className={`${proposed ? '' : 'brightness-75'}`}
            />

            {!proposed && (
                <CustomImage
                    className='absolute z-10 top-0'
                    src={`/static/images/blocks/cubes/missed_block.webp`}
                    alt='Missed Logo'
                    width={50}
                    height={50}
                />
            )}

            {proposed && showCheck && (
                <CustomImage
                    src='/static/images/icons/proposed_block.webp'
                    alt='Proposed block check illustration'
                    width={40}
                    height={40}
                    className='absolute -bottom-2 -right-2'
                />
            )}
        </div>
    );
};

export default BlockImage;
