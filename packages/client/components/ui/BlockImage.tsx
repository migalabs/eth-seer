import React from 'react';

// Components
import CustomImage from './CustomImage';

// Types
import { Slot } from '../../types';

// Constants
import { POOLS } from '../../constants';

type Props = {
    slot: Slot;
};

const BlockImage = ({ slot }: Props) => {
    const missedExtension = slot.f_proposed ? '' : '_missed';

    const getUrl = (poolName: string) => {
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
            <CustomImage src={getUrl(slot.f_pool_name)} alt='Logo' width={60} height={60} />

            {slot.f_proposed && (
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
