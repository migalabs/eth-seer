import React, { useContext } from 'react';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

// Components
import CustomImage from './CustomImage';

type Props = {
    forceOrange?: boolean;
    forceBlue?: boolean;
};

const LinkIcon = ({ forceOrange, forceBlue }: Props) => {
    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) || {};

    const getUrl = () => {
        if (forceOrange) {
            return '/static/images/link_orange.svg';
        } else if (forceBlue) {
            return '/static/images/link_blue.svg';
        } else {
            return themeMode?.darkMode ? '/static/images/link_blue.svg' : '/static/images/link_orange.svg';
        }
    };

    return <CustomImage src={getUrl()} alt='Link icon' width={20} height={20} className='mb-1' />;
};

export default LinkIcon;
