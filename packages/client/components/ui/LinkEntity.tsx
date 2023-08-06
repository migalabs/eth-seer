import React from 'react';
import Link from 'next/link';

// Components
import LinkIcon from './LinkIcon';

// Types
type Props = {
    entity: string;
    children?: React.ReactNode;
};

const LinkEntity = ({ entity, children }: Props) => {
    return (
        <Link
            href={{
                pathname: '/entities/[name]',
                query: {
                    name: entity,
                },
            }}
            passHref
            as={`/entities/${entity}`}
            className='flex gap-x-1 items-center w-fit mx-auto'
        >
            {children ?? (
                <>
                    <p>{entity}</p>
                    <LinkIcon />
                </>
            )}
        </Link>
    );
};

export default LinkEntity;
