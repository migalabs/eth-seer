import React from 'react';

type Props = {
    darkMode: boolean;
    notEpoch: boolean;
};

const EpochAnimation = ({ darkMode, notEpoch }: Props) => {
    const assetPrefix = process.env.NEXT_PUBLIC_ASSET_PREFIX || '';

    const getTextImageName = () => {
        if (notEpoch) {
            if (darkMode) {
                return 'text2-white.png';
            } else {
                return 'text2.png';
            }
        } else {
            if (darkMode) {
                return 'text-white.png';
            } else {
                return 'text.png';
            }
        }
    };

    return (
        <div className='animation-container'>
            <div className='panda-container'>
                <img src={`${assetPrefix}/static/images/epoch_animation/1.png`} alt='Image 1' className='panda-image' />
                <img src={`${assetPrefix}/static/images/epoch_animation/2.png`} alt='Image 2' className='cloud one' />
                <img src={`${assetPrefix}/static/images/epoch_animation/2.png`} alt='Image 3' className='cloud two' />
                <img src={`${assetPrefix}/static/images/epoch_animation/2.png`} alt='Image 4' className='cloud three' />
                <img
                    src={`${assetPrefix}/static/images/epoch_animation/4.png`}
                    alt='Image 5'
                    className='panda-sleep-one'
                />
                <img
                    src={`${assetPrefix}/static/images/epoch_animation/4.png`}
                    alt='Image 6'
                    className='panda-sleep-two'
                />
                <img
                    src={`${assetPrefix}/static/images/epoch_animation/3.png`}
                    alt='Image 7'
                    className='panda-tumbleweed'
                />
                <img
                    src={`${assetPrefix}/static/images/epoch_animation/${getTextImageName()}`}
                    alt='Image 8'
                    className='panda-text'
                />
            </div>
        </div>
    );
};

export default EpochAnimation;
