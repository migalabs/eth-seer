import React, { useState, useContext } from 'react';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

// Components
import CustomImage from './CustomImage';

// Props
type Props = {
    value: string;
};

const CopyIcon = ({ value }: Props) => {
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
            src={`/static/images/icons/${copied ? 'copied' : 'copy'}_${themeMode?.darkMode ? 'dark' : 'light'}.webp`}
            alt='Copy icon'
            width={20}
            height={20}
            onClick={() => handleCopyClick()}
        />
    );
};

export default CopyIcon;
