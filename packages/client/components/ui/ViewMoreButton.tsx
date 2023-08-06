import React, { useContext } from 'react';

// Theme Mode Context
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

// Props
type Props = {
    onClick: () => void;
};

const ViewMoreButton = ({ onClick }: Props) => {
    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) ?? {};

    return (
        <button
            className='flex cursor-pointer mx-auto w-fit text-[10px] text-black rounded-[22px] px-6 py-4'
            onClick={onClick}
            style={{
                backgroundColor: themeMode?.darkMode ? 'var(--yellow2)' : 'var(--blue1)',
                boxShadow: themeMode?.darkMode ? 'var(--boxShadowYellow1)' : 'var(--boxShadowBlue1)',
            }}
        >
            VIEW MORE
        </button>
    );
};

export default ViewMoreButton;
