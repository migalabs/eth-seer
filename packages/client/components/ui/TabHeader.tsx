import React, { useContext } from 'react';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

type Props = {
    header: string;
    isSelected: boolean;
    onClick?: () => void;
};

const TabHeader = ({ header, isSelected, onClick }: Props) => {
    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) ?? {};

    const getBackgroundColor = () => {
        if (isSelected) {
            return themeMode?.darkMode ? 'var(--white)' : 'var(--white)';
        } else {
            return themeMode?.darkMode ? 'var(--bgFairDarkMode)' : 'var(--bgFairLightMode)';
        }
    };

    const getColor = () => {
        if (isSelected) {
            return themeMode?.darkMode ? 'var(--black)' : 'var(--black)';
        } else {
            return themeMode?.darkMode ? 'var(--white)' : 'var(--darkGray)'
        }
    };


    return (
        <div
            className='flex items-center justify-center border border-white py-4 px-8 rounded-md cursor-pointer shadow-md'
            style={{
                backgroundColor: getBackgroundColor(),
                color: getColor()
            }}
            onClick={onClick}
        >
            <p className='text-center text-xs font-medium text-[16px]'>{header}</p>
        </div>
    );
};

export default TabHeader;
