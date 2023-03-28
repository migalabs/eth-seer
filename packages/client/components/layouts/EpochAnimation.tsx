import React from 'react';

type Props = {
    darkMode: boolean
}

const EpochAnimation = ({darkMode}: Props) => {
    return (
        <div className='animation-container'>
            <div className='panda-container'>
                <img src='/static/images/epoch_animation/1.png' alt='Image 1' className='panda-image' />
                <img src='/static/images/epoch_animation/2.png' alt='Image 2' className='cloud one' />
                <img src='/static/images/epoch_animation/2.png' alt='Image 3' className='cloud two' />
                <img src='/static/images/epoch_animation/2.png' alt='Image 4' className='cloud three' />
                <img src='/static/images/epoch_animation/4.png' alt='Image 5' className='panda-sleep-one' />
                <img src='/static/images/epoch_animation/4.png' alt='Image 6' className='panda-sleep-two' />
                <img src='/static/images/epoch_animation/3.png' alt='Image 7' className='panda-tumbleweed' />
                <img src={darkMode ? "/static/images/epoch_animation/text-white.png" : "/static/images/epoch_animation/text.png"} alt="Image 8" className="panda-text" />
            </div>
        </div>
    );
};

export default EpochAnimation;
