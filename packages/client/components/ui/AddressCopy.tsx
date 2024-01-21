import React from 'react';

// Components
import CopyIcon from './CopyIcon';

// Helpers
import { getShortAddress } from '../../helpers/addressHelper';

// Props
type Props = {
    className?: string;
    address: string | undefined;
};

const AddressCopy = ({ className, address }: Props) => {
    return (
        <div className={`flex gap-x-2 items-center uppercase ${className ?? ''}`}>
            <CopyIcon value={address ?? ''} />
            <span>{getShortAddress(address)}</span>
        </div>
    );
};

export default AddressCopy;
