import React, { useContext } from 'react';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

type Props = {
    notEpoch: boolean;
};

const EpochAnimation = ({ notEpoch }: Props) => {
    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) ?? {};

    const getText = () => {
        if (notEpoch) {
            return 'Epoch not saved yet';
        } else {
            return "We're not there yet";
        }
    };

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
                className={`md:text-[80px] text-[50px] uppercase font-medium text-center  ${
                    themeMode?.darkMode ? 'text-white' : 'text-[var(--darkGray)]'
                }`}
            >
                {getText()}
            </p>
            <span className='border-gray-300 h-20 w-20 animate-spin rounded-full border-8 border-t-[var(--darkGray)]'></span>
        </div>
    );
};

export default EpochAnimation;
