import React, { useState, useEffect } from 'react';

// Helpers
import { getImageUrlEntity } from '../../helpers/imageUrlsHelper';

type Props = {
    poolName: string;
    width: number;
    height: number;
};

const BlockGif = ({ poolName, width, height }: Props) => {
    // States
    const [urlImage, setUrlImage] = useState('');

    useEffect(() => {
        setUrlImage(`url(${getImageUrlEntity()})`);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [poolName]);

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
