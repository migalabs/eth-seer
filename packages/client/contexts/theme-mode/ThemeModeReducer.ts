import { SET_DARK_MODE, SET_LIGHT_MODE } from './ThemeModeTypes';

const StatusReducer = (state: any, action: any) => {
    switch (action.type) {
        case SET_DARK_MODE:
            return {
                ...state,
                darkMode: true,
            };
        case SET_LIGHT_MODE:
            return {
                ...state,
                darkMode: false,
            };
        default:
            return state;
    }
};

export default StatusReducer;
