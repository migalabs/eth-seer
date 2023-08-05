import React from 'react';
import Link from 'next/link';

// Components
import LinkIcon from './LinkIcon';

// Types
type Props = {
    epoch: number | undefined;
};

const LinkEpoch = ({ epoch }: Props) => {
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
            <p>{epoch?.toLocaleString()}</p>
            <LinkIcon />
        </Link>
    );
};

export default LinkEpoch;
