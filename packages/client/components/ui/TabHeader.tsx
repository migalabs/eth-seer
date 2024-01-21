import React, { useContext, useState } from 'react';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

// Hooks
import useLargeView from '../../hooks/useLargeView';

// Props
type Props = {
    header: string;
    isSelected: boolean;
    onClick?: () => void;
};

const TabHeader = ({ header, isSelected, onClick }: Props) => {
    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) ?? {};

    // Large View Hook
    const isLargeView = useLargeView();

    // States
    const [isHovered, setIsHovered] = useState(false);

    const getBackgroundColor = () => {
        if (isSelected) {
            return 'var(--white)';
        } else {
            return 'var(--bgFairLightMode)';
        }
    };

    const getColor = () => {
        if (isSelected) {
            return 'var(--black)';
        } else {
            return themeMode?.darkMode ? 'var(--white)' : 'var(--darkGray)';
        }
    };

    const hoverStyles = {
        backgroundColor: isHovered && !isSelected ? 'var(--bgMainLightMode)' : getBackgroundColor(),
        color: isHovered && !isSelected ? '' : getColor(),
    };

    const handleMouseEnter = () => {
        if (isLargeView) {
            setIsHovered(true);
        }
    };

    return (
        <div
            className='flex items-center justify-center border border-white py-4 px-8 rounded-md cursor-pointer shadow-md transition-all'
            style={hoverStyles}
            onClick={onClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={() => setIsHovered(false)}
        >
            <p className='text-center text-[14px] font-medium md:text-[16px]'>{header}</p>
        </div>
    );
};

export default TabHeader;
