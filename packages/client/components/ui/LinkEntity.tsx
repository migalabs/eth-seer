import React from 'react';

// Components
import LinkIcon from './LinkIcon';
import NetworkLink from './NetworkLink';

// Types
type Props = {
    entity: string;
    children?: React.ReactNode;
};

const LinkEntity = ({ entity, children }: Props) => {
    return (
        <NetworkLink href={`/entity/${entity}`} passHref className='flex gap-x-1 items-center w-fit mx-auto'>
            {children ?? (
                <>
                    <p>{entity}</p>
                    <LinkIcon />
                </>
            )}
        </NetworkLink>
    );
};

export default LinkEntity;
