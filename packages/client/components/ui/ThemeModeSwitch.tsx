import React, { useContext } from 'react';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

const ThemeModeSwitch = () => {
    // Theme Mode Context
    const { themeMode, switchMode } = useContext(ThemeModeContext) || {};

    const handleChange = () => {
        console.log('handleChange');
        switchMode?.();
    };

    return (
        <label htmlFor='theme' className='theme'>
            <span className='theme__toggle-wrap'>
                <input
                    id='theme'
                    className='theme__toggle'
                    type='checkbox'
                    name='theme'
                    checked={themeMode?.darkMode || false}
                    onChange={handleChange}
                />
                {/* <span className='theme__fill'></span> */}
                <span className='theme__icon'>
                    <span className='theme__icon-part'></span>
                    <span className='theme__icon-part'></span>
                    <span className='theme__icon-part'></span>
                    <span className='theme__icon-part'></span>
                    <span className='theme__icon-part'></span>
                    <span className='theme__icon-part'></span>
                    <span className='theme__icon-part'></span>
                    <span className='theme__icon-part'></span>
                    <span className='theme__icon-part'></span>
                </span>
            </span>
        </label>
    );
};

export default ThemeModeSwitch;
