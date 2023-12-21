import { motion } from 'framer-motion';
import { useState } from 'react';

type Props = {
    showClient: boolean;
    setShowClient: (show: boolean) => void;
};
const ToggleHomepage = ({ setShowClient, showClient }: Props) => {
    return (
        <div className='flex justify-center items-center gap-2 font-medium'>
            <span className='text-[16px] text-[var(--darkGray)]'>CL Clients</span>
            <div
                onClick={() => setShowClient(!showClient)}
                className={`flex h-6 w-12 cursor-pointer rounded-full p-[2px] ${
                    showClient ? 'bg-white justify-start' : 'bg-[var(--darkGray)] justify-end'
                }`}
            >
                <motion.div
                    className={`h-5 w-5 rounded-full ${showClient ? ' bg-[var(--darkGray)]' : 'bg-white'}`}
                    layout
                    transition={{ type: 'spring', stiffness: 700, damping: 30 }}
                />
            </div>
            <span className='text-[16px] text-[var(--darkGray)]'>Entities</span>
        </div>
    );
};

export default ToggleHomepage;
