import React, { useContext } from 'react';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

// Components
import CustomImage from './CustomImage';

const LinkIcon = () => {
    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) || {};

    return (
        <CustomImage
            src={themeMode?.darkMode ? '/static/images/link_blue.svg' : '/static/images/link_orange.svg'}
            alt='Link icon'
            width={20}
            height={20}
            className='mb-1'
        />
    );
};

export default LinkIcon;
