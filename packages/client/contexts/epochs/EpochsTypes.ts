// Types
import { Epoch } from '../../types';

export const ADD_EPOCHS = 'ADD_EPOCHS';
export const SET_LAST_PAGE_FETCHED = 'SET_LAST_PAGE_FETCHED';

export interface IEpochs {
    epochs: Epoch[];
    lastPageFetched: boolean;
}

export interface EpochsContextType {
    epochs: IEpochs;
    startEventSource: () => boolean;
    closeEventSource: () => void;
    getEpochs: (page: number, limit?: number) => void;
}
