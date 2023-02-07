import { ADD_BLOCKS, CLOSE_CONNECTION } from './BlocksTypes';

const BlocksReducer = (state: any, action: any) => {
    switch (action.type) {
        case ADD_BLOCKS:
            return {
                ...state,
                epochs: {
                    ...state.epochs,
                    ...action.payload,
                },
            };

        case CLOSE_CONNECTION:
            return {
                ...state,
                epochs: [],
            };

        default:
            return state;
    }
};

export default BlocksReducer;
