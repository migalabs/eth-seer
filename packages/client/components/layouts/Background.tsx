import React, { useContext } from 'react';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

const Background = () => {
    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) ?? {};

    // Constants
    // const rows = 16;
    // const bricksPerRow = 9;

    // return (
    //     <div className='fixed w-full -z-10'>
    //         {Array.from(Array(rows).keys()).map(row => (
    //             <div key={row} className='flex bg-gradient-radial from-violet-900 via-violet-700 to-violet-200'>
    //                 {Array.from(Array(bricksPerRow).keys()).map(brick => (
    //                     <div
    //                         key={brick}
    //                         className='w-[15%] h-[3vw] rounded-[2px] m-0.5'
    //                         style={{
    //                             backgroundColor: themeMode?.darkMode ? '#392370' : '#ab6003',
    //                             boxShadow: `5px 5px 5px 1px darken(${
    //                                 themeMode?.darkMode ? '#20124d' : '#783f04'
    //                             }, 20%) inset`,
    //                         }}
    //                     ></div>
    //                 ))}
    //             </div>
    //         ))}
    //     </div>
    // );
    return (
        <div className='fixed w-[100%] -z-10 '>
            <div
                className='h-screen'
                style={{
                    backgroundColor: themeMode?.darkMode ? 'var(--background-dark)' : 'var(--background-light)',
                }}
            ></div>
        </div>
    );
};

export default Background;
