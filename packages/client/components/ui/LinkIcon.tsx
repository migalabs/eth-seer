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
    const { themeMode } = useContext(ThemeModeContext) ?? {};

    const getUrl = () => {
        if (forceOrange) {
            return '/static/images/icons/link_orange.webp';
        } else if (forceBlue) {
            return '/static/images/icons/link_blue.webp';
        } else {
            return themeMode?.darkMode
                ? '/static/images/icons/link_blue.webp'
                : '/static/images/icons/link_orange.webp';
        }
    };

    return <CustomImage src={getUrl()} alt='Link icon' width={20} height={20} className='mb-1' />;
};

export default LinkIcon;
