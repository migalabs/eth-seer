import React, { useContext } from 'react';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

type Props = {
    text: string;
};

const InfoBox = ({ text }: Props) => {
    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) ?? {};

    return (
        <div
            className='flex flex-col items-center justify-center gap-y-5 h-[65vh] xl:h-[70vh] rounded-md mx-auto w-11/12 xl:w-10/12 text-[var(--darkGray)] dark:text-[var(--white)] bg-[var(--bgMainLightMode)] dark:bg-[var(--bgFairDarkMode)]'
            style={{
                boxShadow: themeMode?.darkMode ? 'var(--boxShadowCardDark)' : 'var(--boxShadowCardLight)',
            }}
        >
            <span className='text-[50px] md:text-[80px] uppercase font-medium text-center text-[var(--darkGray)] dark:text-[var(--white)]'>
                {text}
            </span>
        </div>
    );
};

export default InfoBox;
