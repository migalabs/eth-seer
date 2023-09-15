import { useReducer, useEffect } from 'react';

import ThemeModeContext from './ThemeModeContext';
import ThemeModeReducer from './ThemeModeReducer';

import { SET_DARK_MODE, SET_LIGHT_MODE } from './ThemeModeTypes';

const ThemeModeState = (props: any) => {
    const initialState = {
        darkMode: false,
    };

    const [state, dispatch] = useReducer(ThemeModeReducer, initialState);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const themeMode = localStorage.getItem('themeMode');

            if (!themeMode) {
                // First time user
                if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    setDarkMode();
                } else {
                    setLightMode();
                }
            } else if (themeMode === 'dark') {
                setDarkMode();
            } else {
                setLightMode();
            }
        }

        const body = document.querySelector('body');

        if (state.darkMode) {
            body?.style.setProperty('background-image', 'var(--background-dark)');
        } else {
            body?.style.setProperty('background-image', 'var(--background-light)');
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.darkMode]);

    const setDarkMode = () => {
        localStorage.setItem('themeMode', 'dark');

        dispatch({
            type: SET_DARK_MODE,
        });
    };

    const setLightMode = () => {
        localStorage.setItem('themeMode', 'light');

        dispatch({
            type: SET_LIGHT_MODE,
        });
    };

    const switchMode = () => {
        if (state.darkMode) {
            setLightMode();
        } else {
            setDarkMode();
        }
    };

    return (
        <ThemeModeContext.Provider
            value={{
                themeMode: state,
                setDarkMode,
                setLightMode,
                switchMode,
            }}
        >
            {props.children}
        </ThemeModeContext.Provider>
    );
};

export default ThemeModeState;
