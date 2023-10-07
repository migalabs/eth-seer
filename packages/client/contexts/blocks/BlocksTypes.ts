// Types
import { Block } from '../../types';

export const ADD_BLOCKS = 'ADD_BLOCKS';

export interface IBlocks {
    epochs: Record<number, Block[]>;
}

export interface BlocksContextType {
    blocks: IBlocks;
    startEventSource: (network: string) => boolean;
    closeEventSource: () => void;
    getBlocks: (network: string, page: number, limit?: number, onlyLastEpoch?: boolean) => void;
}
