import React from 'react';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

// Types
import { Block } from '../../types';

type Props = {
    epoch: number;
    blocks: Block[];
    lastEpoch: boolean;
};

const SummaryOverview = () => {
    // Theme Mode Context
    const { themeMode } = React.useContext(ThemeModeContext) || {};

    return (
        <div className='flex justify-center mb-5'>
            <div
                className='grid grid-cols-2 md:grid-cols-4 gap-y-1 items-center justify-around text-center text-[10px] text-black rounded-[22px] px-3 py-4 md:w-[925px]'
                style={{
                    backgroundColor: themeMode?.darkMode ? 'var(--yellow2)' : 'var(--blue1)',
                    boxShadow: themeMode?.darkMode ? 'var(--boxShadowYellow1)' : 'var(--boxShadowBlue1)',
                }}
            >
                <p>Epoch: 100000</p>
                <p>Slot: 100000</p>
                <p>Block Height: 100000</p>
                <p>Validators: 100000</p>
            </div>
        </div>
    );
};

export default SummaryOverview;
