import React from 'react';
import Link from 'next/link';

// Components
import LinkIcon from './LinkIcon';

// Types
type Props = {
    slot: number | undefined;
    children?: React.ReactNode;
    mxAuto?: boolean;
};

const LinkSlot = ({ slot, children, mxAuto }: Props) => {
    return (
        <Link
            href={{
                pathname: '/slots/[id]',
                query: {
                    id: slot,
                },
            }}
            passHref
            as={`/slots/${slot}`}
            className={`flex gap-x-1 items-center w-fit ${mxAuto ? 'mx-auto' : ''}`}
        >
            {children ?? (
                <>
                    <p>{slot?.toLocaleString()}</p>
                    <LinkIcon />
                </>
            )}
        </Link>
    );
};

export default LinkSlot;
