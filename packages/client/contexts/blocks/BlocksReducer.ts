import { ADD_BLOCKS } from './BlocksTypes';

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

        default:
            return state;
    }
};

export default BlocksReducer;
