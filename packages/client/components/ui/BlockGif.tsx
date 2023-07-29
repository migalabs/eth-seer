import React, { useState, useEffect } from 'react';

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

    // States
    const [urlImage, setUrlImage] = useState('url(/static/images/blocks/covers/others.png)');

    useEffect(() => {
        // setUrlImage(`url(${getUrl()})`);
    }, [poolName]);

    const getUrl = () => {
        if (poolName && POOLS.includes(poolName.toUpperCase())) {
            return `/static/images/blocks/covers/${poolName.toLowerCase()}.svg`;
        } else if (poolName && poolName.includes('lido')) {
            return `/static/images/blocks/covers/lido.svg`;
        } else if (poolName && poolName.includes('whale')) {
            return `/static/images/blocks/covers/whale.svg`;
        } else {
            return `/static/images/blocks/covers/others.svg`;
        }
    };

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
