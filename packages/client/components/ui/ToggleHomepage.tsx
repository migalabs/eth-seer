import { motion } from 'framer-motion';
import { useState } from 'react';

export default function ToggleHomepage() {
    const [toggle, setToggle] = useState<boolean>(false);
    return (
        <div className='flex justify-center items-center gap-2 font-medium'>
            <span className='text-[16px] text-[var(--darkGray)]'>Entities</span>
            <div
                onClick={() => setToggle(!toggle)}
                className={`flex h-6 w-12 cursor-pointer rounded-full p-[2px] ${
                    toggle ? 'bg-white justify-start' : 'bg-[var(--darkGray)] justify-end'
                }`}
            >
                <motion.div
                    className={`h-5 w-5 rounded-full ${toggle ? ' bg-[var(--darkGray)]' : 'bg-white'}`}
                    layout
                    transition={{ type: 'spring', stiffness: 700, damping: 30 }}
                />
            </div>
            <span className='text-[16px] text-[var(--darkGray)]'>CL</span>
        </div>
    );
}
