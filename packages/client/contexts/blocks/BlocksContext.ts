import { createContext } from 'react';
import { BlocksContextType } from './BlocksTypes';

const BlocksContext = createContext<BlocksContextType | null>(null);

export default BlocksContext;
