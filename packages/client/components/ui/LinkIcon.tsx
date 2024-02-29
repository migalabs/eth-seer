import React, { useContext } from 'react';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

// Components
import CustomImage from './CustomImage';

type Props = {
    forceLight?: boolean;
    forceDark?: boolean;
};

const LinkIcon = ({ forceLight, forceDark }: Props) => {
    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) ?? {};

    const getUrl = () => {
        if (forceLight) {
            return '/static/images/icons/link_light.webp';
        } else if (forceDark) {
            return '/static/images/icons/link_dark.webp';
        } else {
            return themeMode?.darkMode ? '/static/images/icons/link_dark.webp' : '/static/images/icons/link_light.webp';
        }
    };

    return <CustomImage src={getUrl()} alt='Link icon' width={15} height={15} />;
};

export default LinkIcon;
