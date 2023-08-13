import React, { useContext } from 'react';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

// Components
import CustomImage from './CustomImage';

// Props
type Props = {
    direction: 'right' | 'left';
    height?: number;
    width?: number;
    className?: string;
    onClick?: () => void;
};

const Arrow = ({ direction, height = 15, width = 15, className, onClick }: Props) => {
    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) ?? {};

    return (
        <CustomImage
            src={themeMode?.darkMode ? '/static/images/arrow.svg' : '/static/images/arrow-blue.svg'}
            alt='Navigation arrow'
            width={width}
            height={height}
            onClick={() => onClick?.()}
            className={`mb-1 cursor-pointer ${direction === 'right' ? 'rotate-180' : ''} ${className ?? ''}`}
        />
    );
};

export default Arrow;
