import React, { useContext } from 'react';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

type Props = {
    text: string;
};

const Animation = ({ text }: Props) => {
    const assetPrefix = process.env.NEXT_PUBLIC_ASSET_PREFIX ?? '';

    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) ?? {};

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
                <p className={`panda-text ${themeMode?.darkMode ? 'text-white' : 'text-black'}`}>{text}</p>
            </div>
        </div>
    );
};

export default Animation;
