import React, { useContext } from 'react';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

const Background = () => {
    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) ?? {};

    // Constants
    const rows = 16;
    const bricksPerRow = 9;

    return (
        <div className='fixed w-full -z-10'>
            {Array.from(Array(rows).keys()).map(row => (
                <div key={row} className='flex bg-[#ccc]'>
                    {Array.from(Array(bricksPerRow).keys()).map(brick => (
                        <div
                            key={brick}
                            className='w-[15%] h-[3vw] rounded-[2px] m-0.5'
                            style={{
                                backgroundColor: themeMode?.darkMode ? '#bd5858' : '#bd5858',
                                boxShadow: `0 0 19px 1px darken(${
                                    themeMode?.darkMode ? '#bd5858' : '#bd5858'
                                }, 20%) inset`,
                            }}
                        ></div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Background;
