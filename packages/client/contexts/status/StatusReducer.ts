import { SET_WORKING, SET_NOT_WORKING } from './StatusTypes';

const StatusReducer = (state: any, action: any) => {
    switch (action.type) {
        case SET_WORKING:
            return {
                ...state,
                working: true,
            };
        case SET_NOT_WORKING:
            return {
                ...state,
                working: false,
            };
        default:
            return state;
    }
};

export default StatusReducer;
