export const SET_DARK_MODE = 'SET_DARK_MODE';
export const SET_LIGHT_MODE = 'SET_LIGHT_MODE';

export interface IThemeMode {
    darkMode: boolean;
}

export interface ThemeModeContextType {
    themeMode: IThemeMode;
    setDarkMode: () => void;
    setLightMode: () => void;
    switchMode: () => void;
}
