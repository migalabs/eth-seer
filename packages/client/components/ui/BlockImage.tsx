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
    const missedExtension = proposed ? '' : '_missed';

    const getUrl = () => {
        if (poolName && POOLS.includes(poolName.toUpperCase())) {
            return `/static/images/blocks/block_${poolName.toLowerCase()}${missedExtension}.svg`;
        } else if (poolName && poolName.includes('lido')) {
            return `/static/images/blocks/block_lido${missedExtension}.svg`;
        } else if (poolName && poolName.includes('whale')) {
            return `/static/images/blocks/block_whale${missedExtension}.svg`;
        } else {
            return `/static/images/blocks/block_others${missedExtension}.svg`;
        }
    };

    return (
        <div className='relative'>
            <CustomImage src={getUrl()} alt='Logo' width={width} height={height} />

            {proposed && showCheck && (
                <CustomImage
                    src='/static/images/check.svg'
                    alt='Check'
                    width={40}
                    height={40}
                    className='absolute -bottom-2 -right-2'
                />
            )}
        </div>
    );
};

export default BlockImage;
