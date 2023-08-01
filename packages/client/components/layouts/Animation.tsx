import React, { useContext } from 'react';
import Image from 'next/image';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

// Images
import Image1 from '../../public/static/images/epoch_animation/1.png';
import Image2 from '../../public/static/images/epoch_animation/2.png';
import Image3 from '../../public/static/images/epoch_animation/3.png';
import Image4 from '../../public/static/images/epoch_animation/4.png';

type Props = {
    text: string;
};

const Animation = ({ text }: Props) => {
    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) ?? {};

    return (
        <div className='animation-container'>
            <div className='panda-container'>
                <Image src={Image1} alt='Image 1' className='panda-image' priority />
                <Image src={Image2} alt='Image 2' className='cloud one' priority />
                <Image src={Image2} alt='Image 3' className='cloud two' priority />
                <Image src={Image2} alt='Image 4' className='cloud three' priority />
                <Image src={Image4} alt='Image 5' className='panda-sleep-one' priority />
                <Image src={Image4} alt='Image 6' className='panda-sleep-two' priority />
                <Image src={Image3} alt='Image 7' className='panda-tumbleweed' priority />
                <p className={`panda-text ${themeMode?.darkMode ? 'text-white' : 'text-black'}`}>{text}</p>
            </div>
        </div>
    );
};

export default Animation;
