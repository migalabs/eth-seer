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
        <div className='flex justify-center space-x-4 md:space-x-5 px-7 mb-5'>
            <div
                className='flex flex-row gap-10 items-center justify-around text-[10px] text-black rounded-[22px] px-3 py-4 md:left-[calc(50%-210px)] w-[calc(100%-2rem)] md:w-[1000px]'
                style={{
                    backgroundColor: themeMode?.darkMode ? 'var(--yellow2)' : 'var(--blue1)',
                    boxShadow: themeMode?.darkMode ? 'var(--boxShadowYellow1)' : 'var(--boxShadowBlue1)',
                }}
            >
                <p>Epoch: 100000</p>
                <p>Slot: 100000</p>
                <p>Block Height: 100000</p>
                <p>Num. Validators: 100000</p>
            </div>
        </div>
    );
};

export default SummaryOverview;
