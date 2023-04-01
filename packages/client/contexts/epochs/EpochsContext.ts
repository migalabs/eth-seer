import { createContext } from 'react';
import { EpochsContextType } from './EpochsTypes';

const EpochsContext = createContext<EpochsContextType | null>(null);

export default EpochsContext;
