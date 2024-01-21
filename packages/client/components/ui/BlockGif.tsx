import React, { useState, useEffect } from 'react';

// Constants
import { POOLS } from '../../constants';

type Props = {
    poolName: string;
    width: number;
    height: number;
};

const BlockGif = ({ poolName, width, height }: Props) => {
    // States
    const [urlImage, setUrlImage] = useState('');

    useEffect(() => {
        setUrlImage(`url(${getUrl()})`);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [poolName]);

    const getUrl = () => {
        if (poolName && POOLS.includes(poolName.toUpperCase())) {
            return `/static/images/blocks/covers/${poolName.toLowerCase()}.webp`;
        } else if (poolName && poolName.includes('lido')) {
            return '/static/images/blocks/covers/lido.webp';
        } else if (poolName && poolName.includes('whale')) {
            return '/static/images/blocks/covers/whale-ethereum-entity.webp';
        } else {
            return '/static/images/blocks/covers/unknown-ethereum-entity.webp';
        }
    };

    if (!poolName) {
        return null;
    }

    return (
        <div className='body-cube' style={{ width, height }}>
            <div className='container'>
                <div className='cube'>
                    <div className='cube-top' style={{ backgroundImage: urlImage }}></div>
                    <div className='cube-bottom' style={{ backgroundImage: urlImage }}></div>
                    <div className='cube-left' style={{ backgroundImage: urlImage }}></div>
                    <div className='cube-right' style={{ backgroundImage: urlImage }}></div>
                    <div className='cube-front' style={{ backgroundImage: urlImage }}></div>
                    <div className='cube-back' style={{ backgroundImage: urlImage }}></div>
                </div>
            </div>
        </div>
    );
};

export default BlockGif;
