import React from 'react';
import Link from 'next/link';

// Components
import LinkIcon from './LinkIcon';

// Types
type Props = {
    slot: number | undefined;
    children?: React.ReactNode;
};

const LinkSlot = ({ slot, children }: Props) => {
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
            className='flex gap-x-1 items-center w-fit mx-auto'
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
