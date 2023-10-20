import { NetworksContextType } from './NetworksTypes';

type ActionType = { type: 'SET_NETWORKS'; payload: String[] } | { type: 'SET_FETCHED'; payload: boolean };

const NetworksReducer = (state: NetworksContextType, action: ActionType): NetworksContextType => {
    switch (action.type) {
        case 'SET_NETWORKS':
            return { ...state, networks: action.payload };
        case 'SET_FETCHED':
            return { ...state, fetched: action.payload };
        default:
            return state;
    }
};

export default NetworksReducer;
