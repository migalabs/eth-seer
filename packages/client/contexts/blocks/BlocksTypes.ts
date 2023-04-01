// Types
import { Block } from '../../types';

export const ADD_BLOCKS = 'ADD_BLOCKS';

export interface IBlocks {
    epochs: Record<number, Block[]>;
}

export interface BlocksContextType {
    blocks: IBlocks;
    startEventSource: () => boolean;
    closeEventSource: () => void;
    getBlocks: (page: number, limit?: number, onlyLastEpoch?: boolean) => void;
}
