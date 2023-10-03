import { useReducer, useContext } from 'react';

import BlocksContext from './BlocksContext';
import BlocksReducer from './BlocksReducer';

import { ADD_BLOCKS } from './BlocksTypes';

// Axios
import axiosClient from '../../config/axios';

// Contexts
import StatusContext from '../status/StatusContext';

// Types
import { Block } from '../../types';

const BlocksState = (props: any) => {
    // Status Context
    const { setNotWorking } = useContext(StatusContext) ?? {};

    const initialState = {
        epochs: null,
    };

    const [state, dispatch] = useReducer(BlocksReducer, initialState);

    let eventSourceBlock: EventSource;

    // Start event source
    const startEventSource = (network: string) => {
        try {
            if (!eventSourceBlock || eventSourceBlock.readyState === eventSourceBlock.CLOSED) {
                eventSourceBlock = new EventSource(
                    `${process.env.NEXT_PUBLIC_URL_API}/api/slots/new-slot-notification?network=${network}`
                );

                eventSourceBlock.addEventListener('new_slot', function (e) {
                    getBlocks(network, 0, 32, true);
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
        if (eventSourceBlock) {
            eventSourceBlock.close();
        }
    };

    let isFetching = false;

    // Get blocks
    const getBlocks = async (network: string, page: number, limit: number = 320, onlyLastEpoch: boolean = false) => {
        try {
            if (isFetching) {
                return;
            }

            isFetching = true;

            const response = await axiosClient.get(`/api/slots/blocks`, {
                params: {
                    network,
                    limit,
                    page,
                },
            });

            let blocks: Record<number, Block[]> = {};
            let lastEpochAux = -1;

            response.data.blocks.forEach((block: Block) => {
                if (onlyLastEpoch && block.f_epoch > lastEpochAux) {
                    lastEpochAux = block.f_epoch;
                    blocks = {};
                }

                if (blocks[block.f_epoch]) {
                    if (!blocks[block.f_epoch].some(b => b.f_slot === block.f_slot)) {
                        blocks[block.f_epoch] = [block, ...blocks[block.f_epoch]];
                    }
                } else {
                    blocks[block.f_epoch] = [block];
                }
            });

            dispatch({
                type: ADD_BLOCKS,
                payload: blocks,
            });

            isFetching = false;
        } catch (error) {
            console.log(error);
            setNotWorking?.();
            isFetching = false;
        }
    };

    return (
        <BlocksContext.Provider
            value={{
                blocks: state,
                startEventSource,
                closeEventSource,
                getBlocks,
            }}
        >
            {props.children}
        </BlocksContext.Provider>
    );
};

export default BlocksState;
