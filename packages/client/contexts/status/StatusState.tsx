import { useReducer } from 'react';

import StatusContext from './StatusContext';
import StatusReducer from './StatusReducer';

import { SET_WORKING, SET_NOT_WORKING } from './StatusTypes';

const StatusState = (props: any) => {
    const initialState = {
        working: true,
    };

    const [state, dispatch] = useReducer(StatusReducer, initialState);

    const setWorking = () => {
        dispatch({
            type: SET_WORKING,
        });
    };

    const setNotWorking = () => {
        dispatch({
            type: SET_NOT_WORKING,
        });
    };

    return (
        <StatusContext.Provider
            value={{
                status: state,
                setWorking,
                setNotWorking,
            }}
        >
            {props.children}
        </StatusContext.Provider>
    );
};

export default StatusState;
