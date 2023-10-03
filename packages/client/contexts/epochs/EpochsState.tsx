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
    const { setNotWorking } = useContext(StatusContext) ?? {};

    const initialState = {
        epochs: [],
        lastPageFetched: false,
    };

    const [state, dispatch] = useReducer(EpochsReducer, initialState);

    let eventSourceEpoch: EventSource;

    // Start event source
    const startEventSource = (network: string) => {
        try {
            if (!eventSourceEpoch || eventSourceEpoch.readyState === eventSourceEpoch.CLOSED) {
                eventSourceEpoch = new EventSource(
                    `${process.env.NEXT_PUBLIC_URL_API}/api/epochs/new-epoch-notification?network=${network}`
                );

                eventSourceEpoch.addEventListener('new_epoch', function (e) {
                    getEpochs(network, 0, 2);
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

    let isFetching = false;

    // Get blocks
    const getEpochs = async (network: string, page: number, limit: number = 10) => {
        try {
            if (state.lastPageFetched || isFetching) {
                return;
            }

            isFetching = true;

            const response = await axiosClient.get('/api/epochs', {
                params: {
                    network,
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

            isFetching = false;
        } catch (error) {
            console.log(error);
            setNotWorking?.();
            isFetching = false;
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
