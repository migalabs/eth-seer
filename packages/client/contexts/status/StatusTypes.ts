export const SET_WORKING = 'SET_WORKING';
export const SET_NOT_WORKING = 'SET_NOT_WORKING';

export interface IStatus {
    working: boolean;
}

export interface StatusContextType {
    status: IStatus;
    setWorking: () => void;
    setNotWorking: () => void;
}
