import { useReducer, useContext } from 'react';

import EpochsContext from './EpochsContext';
import EpochsReducer from './EpochsReducer';

import { ADD_EPOCHS, SET_LAST_PAGE_FETCHED } from './EpochsTypes';

// Axios
import axiosClient from '../../config/axios';

// Contexts
import StatusContext from '../status/StatusContext';

const EpochsState = (props: any) => {
    // Status Context
    const { setNotWorking } = useContext(StatusContext) || {};

    const initialState = {
        epochs: [],
        lastPageFetched: false,
    };

    const [state, dispatch] = useReducer(EpochsReducer, initialState);

    let eventSourceEpoch: EventSource;

    // Start event source
    const startEventSource = () => {
        try {
            if (!eventSourceEpoch || eventSourceEpoch.readyState === eventSourceEpoch.CLOSED) {
                eventSourceEpoch = new EventSource(
                    `${process.env.NEXT_PUBLIC_URL_API}/api/validator-rewards-summary/new-epoch-notification`
                );

                eventSourceEpoch.addEventListener('new_epoch', function (e) {
                    getEpochs(0, 2);
                });

                return true;
            }
        } catch (error) {
            console.log(error);
            setNotWorking?.();
        }

        return false;
    };

    // Close event source
    const closeEventSource = () => {
        if (eventSourceEpoch) {
            eventSourceEpoch.close();
        }
    };

    // Get blocks
    const getEpochs = async (page: number, limit: number = 10) => {
        try {
            if (state.lastPageFetched) {
                return;
            }

            const response = await axiosClient.get('/api/validator-rewards-summary', {
                params: {
                    limit,
                    page,
                },
            });

            dispatch({
                type: ADD_EPOCHS,
                payload: response.data.epochsStats,
            });

            if (response.data.epochsStats.length === 0) {
                dispatch({
                    type: SET_LAST_PAGE_FETCHED,
                    payload: true,
                });
            }
        } catch (error) {
            console.log(error);
            setNotWorking?.();
        }
    };

    return (
        <EpochsContext.Provider
            value={{
                epochs: state,
                startEventSource,
                closeEventSource,
                getEpochs,
            }}
        >
            {props.children}
        </EpochsContext.Provider>
    );
};

export default EpochsState;
