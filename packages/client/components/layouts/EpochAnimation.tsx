import React, { useContext } from 'react';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

type Props = {
    notEpoch?: boolean;
    notSlot?: boolean;
    notBlock?: boolean;
};

const EpochAnimation = ({ notEpoch, notSlot, notBlock }: Props) => {
    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) ?? {};

    const getText = () => {
        if (notEpoch) {
            return 'Epoch not saved yet';
        } else if (notSlot) {
            return 'Slot not saved yet';
        } else if (notBlock) {
            return 'Block not saved yet';
        } else {
            return "We're not there yet";
        }
    };

    return (
        <div
            className='flex flex-col items-center justify-center gap-y-5 h-[65vh] xl:h-[70vh] rounded-md mx-auto w-11/12 md:w-10/12 text-[var(--darkGray)] dark:text-[var(--white)] bg-[var(--bgMainLightMode)] dark:bg-[var(--bgFairDarkMode)]'
            style={{
                boxShadow: themeMode?.darkMode ? 'var(--boxShadowCardDark)' : 'var(--boxShadowCardLight)',
            }}
        >
            <p className='md:text-[80px] text-[50px] uppercase font-medium text-center text-[var(--darkGray)] dark:text-[var(--white)]'>
                {getText()}
            </p>
            <span className='border-gray-300 h-20 w-20 animate-spin rounded-full border-8 border-t-[var(--darkGray)]'></span>
        </div>
    );
};

export default EpochAnimation;
