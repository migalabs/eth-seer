import React from 'react';
import Link from 'next/link';

// Components
import LinkIcon from './LinkIcon';

// Types
type Props = {
    epoch: number | undefined;
    children?: React.ReactNode;
};

const LinkEpoch = ({ epoch, children }: Props) => {
    return (
        <Link
            href={{
                pathname: '/epochs/[id]',
                query: {
                    id: epoch,
                },
            }}
            passHref
            as={`/epochs/${epoch}`}
            className='flex gap-x-1 items-center w-fit mx-auto'
        >
            {children ?? (
                <>
                    <p>{epoch?.toLocaleString()}</p>
                    <LinkIcon />
                </>
            )}
        </Link>
    );
};

export default LinkEpoch;
