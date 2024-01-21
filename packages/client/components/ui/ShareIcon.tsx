import React, { useState, useContext } from 'react';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

// Components
import CustomImage from './CustomImage';

// Props
type Props = {
    value: string;
};

const ShareIcon = ({ value }: Props) => {
    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) ?? {};

    // States
    const [copied, setCopied] = useState(false);

    // Function to handle the Copy Click event
    const handleCopyClick = async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 250);
    };

    return (
        <CustomImage
            className='cursor-pointer'
            src={`/static/images/icons/${copied ? 'shared' : 'share'}_${themeMode?.darkMode ? 'dark' : 'light'}.webp`}
            alt='Share icon'
            width={50}
            height={50}
            onClick={() => handleCopyClick()}
        />
    );
};

export default ShareIcon;
