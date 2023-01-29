import { createContext } from 'react';
import { StatusContextType } from './StatusTypes';

const StatusContext = createContext<StatusContextType | null>(null);

export default StatusContext;
