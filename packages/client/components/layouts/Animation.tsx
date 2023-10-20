import React, { useContext } from 'react';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

type Props = {
    text: string;
};

const Animation = ({ text }: Props) => {
    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) ?? {};

    return (
        <div
            className='flex items-center justify-center flex-col h-screen gap-y-5 rounded-md mx-auto w-11/12 md:w-10/12'
            style={{
                color: themeMode?.darkMode ? 'var(--white)' : 'var(--darkGray)',
                backgroundColor: themeMode?.darkMode ? 'var(--bgFairDarkMode)' : 'var(--bgMainLightMode)',
                boxShadow: themeMode?.darkMode ? 'var(--boxShadowCardDark)' : 'var(--boxShadowCardLight)',
            }}
        >
            <p
                className={`md:text-[80px] text-[50px] uppercase font-medium text-center ${
                    themeMode?.darkMode ? 'text-white' : 'text-[var(--darkGray)]'
                }`}
            >
                {text}
            </p>
        </div>
    );
};

export default Animation;
