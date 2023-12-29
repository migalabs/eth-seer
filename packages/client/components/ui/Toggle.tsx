import React from 'react';
import { motion } from 'framer-motion';

type Props = {
    value: boolean;
    labelLeft: string;
    labelRight: string;
    onToggle: () => void;
};

const Toggle = ({ value, labelLeft, labelRight, onToggle }: Props) => {
    return (
        <div className='flex justify-center items-center gap-2 font-medium'>
            <span className='text-[12px] md:text-[14px] text-[var(--darkGray)] dark:text-[var(--white)]'>
                {labelLeft}
            </span>

            <button
                onClick={onToggle}
                className={`flex h-5 md:h-6 w-10 md:w-12 cursor-pointer rounded-full p-[2px] ${
                    value ? 'bg-white justify-start' : 'bg-[var(--darkGray)] justify-end'
                }`}
            >
                <motion.div
                    className={`h-4 md:h-5 w-4 md:w-5 rounded-full ${value ? ' bg-[var(--darkGray)]' : 'bg-white'}`}
                    layout
                    transition={{ type: 'spring', stiffness: 700, damping: 30 }}
                />
            </button>

            <span className='text-[12px] md:text-[14px] text-[var(--darkGray)] dark:text-[var(--white)]'>
                {labelRight}
            </span>
        </div>
    );
};

export default Toggle;
