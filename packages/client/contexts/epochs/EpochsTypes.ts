// Types
import { Epoch } from '../../types';

export const ADD_EPOCHS = 'ADD_EPOCHS';
export const SET_LAST_PAGE_FETCHED = 'SET_LAST_PAGE_FETCHED';

export interface IEpochs {
    epochs: Epoch[];
    epochsTotalCount: number;
    lastPageFetched: boolean;
}

export interface EpochsContextType {
    epochs: IEpochs;
    startEventSource: (network: string) => boolean;
    closeEventSource: () => void;
    getEpochs: (network: string, page: number, limit?: number) => Promise<void>;
}
