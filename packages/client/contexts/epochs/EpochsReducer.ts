import { ADD_EPOCHS, SET_LAST_PAGE_FETCHED } from './EpochsTypes';

const EpochsReducer = (state: any, action: any) => {
    switch (action.type) {
        case ADD_EPOCHS:
            return {
                ...state,
                epochs: [
                    ...state.epochs,
                    ...action.payload.filter(
                        (item: any) => !state.epochs.some((item2: any) => item.f_epoch === item2.f_epoch)
                    ),
                ].sort((a, b) => b.f_epoch - a.f_epoch),
            };

        case SET_LAST_PAGE_FETCHED:
            return {
                ...state,
                lastPageFetched: action.payload,
            };

        default:
            return state;
    }
};

export default EpochsReducer;
