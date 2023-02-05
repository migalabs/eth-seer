// Types
import { Block } from '../../types';

export const ADD_BLOCKS = 'ADD_BLOCKS';
export const CLOSE_CONNECTION = 'CLOSE_CONNECTION';

export interface IBlocks {
    epochs: Record<number, Block[]>;
}

export interface BlocksContextType {
    blocks: IBlocks;
    startEventSource: () => void;
    closeEventSource: () => void;
    getBlocks: (page: number, limit?: number, onlyLastEpoch?: boolean) => void;
}
