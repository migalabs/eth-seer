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
            return themeMode?.darkMode ? 'var(--yellow2)' : 'var(--blue1)';
        } else {
            return themeMode?.darkMode ? 'var(--yellow6)' : 'var(--blue2)';
        }
    };

    const getBoxShadow = () => {
        if (isSelected) {
            return themeMode?.darkMode ? 'var(--boxShadowYellow1)' : 'var(--boxShadowBlue4)';
        } else {
            return 'none';
        }
    };

    return (
        <div
            className='flex items-center justify-center py-3 px-7 rounded-3xl cursor-pointer'
            style={{
                backgroundColor: getBackgroundColor(),
                boxShadow: getBoxShadow(),
            }}
            onClick={onClick}
        >
            <p className='text-black text-center uppercase text-xs text-[10px] sm:text-[12px]'>{header}</p>
        </div>
    );
};

export default TabHeader;
