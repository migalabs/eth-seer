import { createContext } from 'react';
import { ThemeModeContextType } from './ThemeModeTypes';

const ThemeModeContext = createContext<ThemeModeContextType | null>(null);

export default ThemeModeContext;
