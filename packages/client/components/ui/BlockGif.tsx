import React from 'react';

// Components
import CustomImage from './CustomImage';

// Constants
import { POOLS } from '../../constants';

type Props = {
    poolName: string;
    width: number;
    height: number;
};

const BlockGif = ({ poolName, width, height }: Props) => {
    if (!poolName) {
        return null;
    }

    const getUrl = () => {
        if (poolName && POOLS.includes(poolName.toUpperCase())) {
            return `/static/gifs/block_${poolName.toLowerCase()}.gif`;
        } else if (poolName && poolName.includes('lido')) {
            return `/static/gifs/block_lido.gif`;
        } else if (poolName && poolName.includes('whale')) {
            return `/static/gifs/block_whale.gif`;
        } else {
            return `/static/gifs/block_others.gif`;
        }
    };

    return <CustomImage src={getUrl()} alt='Logo' width={width} height={height} priority />;
};

export default BlockGif;
