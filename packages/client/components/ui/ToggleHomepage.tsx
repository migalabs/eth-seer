import React, { useContext } from 'react';
import { motion } from 'framer-motion';

// Context
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

type Props = {
    showClient: boolean;
    onToggle: () => void;
};

const ToggleHomepage = ({ showClient, onToggle }: Props) => {
    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) ?? {};

    return (
        <div className='flex justify-center items-center gap-2 font-medium'>
            <span
                className='text-[12px] md:text-[14px]'
                style={{ color: themeMode?.darkMode ? 'var(--white)' : 'var(--darkGray)' }}
            >
                CL Clients
            </span>

            <button
                onClick={onToggle}
                className={`flex h-5 md:h-6 w-10 md:w-12 cursor-pointer rounded-full p-[2px] ${
                    showClient ? 'bg-white justify-start' : 'bg-[var(--darkGray)] justify-end'
                }`}
            >
                <motion.div
                    className={`h-4 md:h-5 w-4 md:w-5 rounded-full ${
                        showClient ? ' bg-[var(--darkGray)]' : 'bg-white'
                    }`}
                    layout
                    transition={{ type: 'spring', stiffness: 700, damping: 30 }}
                />
            </button>

            <span
                className='text-[12px] md:text-[14px]'
                style={{ color: themeMode?.darkMode ? 'var(--white)' : 'var(--darkGray)' }}
            >
                Entities
            </span>
        </div>
    );
};

export default ToggleHomepage;
