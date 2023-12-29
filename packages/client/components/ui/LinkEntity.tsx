import React from 'react';

// Components
import LinkIcon from './LinkIcon';
import NetworkLink from './NetworkLink';

// Types
type Props = {
    entity: string;
    children?: React.ReactNode;
    mxAuto?: boolean;
};

const LinkEntity = ({ entity, children, mxAuto }: Props) => {
    return (
        <NetworkLink
            href={`/entity/${entity}`}
            passHref
            className={`flex gap-x-1 items-center text-[14px] md:text-[16px] font-medium md:hover:underline underline-offset-4 decoration-2 w-fit uppercase text-[var(--darkPurple)] dark:text-[var(--purple)] ${
                mxAuto ? 'mx-auto' : ''
            }`}
        >
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
