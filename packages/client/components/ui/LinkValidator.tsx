import React from 'react';
import Link from 'next/link';

// Components
import LinkIcon from './LinkIcon';

// Types
type Props = {
    validator: number | undefined;
    children?: React.ReactNode;
    mxAuto?: boolean;
};

const LinkValidator = ({ validator, children, mxAuto }: Props) => {
    return (
        <Link
            href={{
                pathname: '/validators/[id]',
                query: {
                    id: validator,
                },
            }}
            passHref
            as={`/validators/${validator}`}
            className={`flex gap-x-1 items-center w-fit ${mxAuto ? 'mx-auto' : ''}`}
        >
            {children ?? (
                <>
                    <p>{validator?.toLocaleString()}</p>
                    <LinkIcon />
                </>
            )}
        </Link>
    );
};

export default LinkValidator;
