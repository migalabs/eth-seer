import { useReducer, useContext, useEffect } from 'react';

import NetworksContext from './NetworksContext';

// Axios
import axiosClient from '../../config/axios';

// Contexts
import StatusContext from '../status/StatusContext';
import NetworksReducer from './NetworksReducer';

const NetworksState = (props: any) => {
    // Status Context
    const { setNotWorking } = useContext(StatusContext) ?? {};

    const getNetworks = async (network: string) => {
        try {
            const response = await axiosClient.get('/api/networks');
            dispatch({ type: 'SET_NETWORKS', payload: response.data });
            dispatch({ type: 'SET_FETCHED', payload: true }); // Indicate data has been fetched
        } catch (error) {
            console.log(error);
            setNotWorking?.();
        }
    };

    const initialState = {
        networks: [],
        fetched: false,
        getNetworks,
    };

    const [state, dispatch] = useReducer(NetworksReducer, initialState);

    return (
        <NetworksContext.Provider
            value={{
                networks: state.networks,
                fetched: state.fetched,
                getNetworks,
            }}
        >
            {props.children}
        </NetworksContext.Provider>
    );
};

export default NetworksState;
