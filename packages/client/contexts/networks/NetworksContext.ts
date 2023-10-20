import { createContext } from 'react';
import { NetworksContextType } from './NetworksTypes';

const NetworksContext = createContext<NetworksContextType | null>(null);

export default NetworksContext;
