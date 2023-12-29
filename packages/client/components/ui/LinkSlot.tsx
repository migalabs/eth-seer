import React from 'react';

// Components
import LinkIcon from './LinkIcon';
import NetworkLink from './NetworkLink';

// Types
type Props = {
    slot: number | undefined;
    children?: React.ReactNode;
    mxAuto?: boolean;
};

const LinkSlot = ({ slot, children, mxAuto }: Props) => {
    return (
        <NetworkLink
            href={`/slot/${slot}`}
            passHref
            className={`flex gap-x-1 items-center text-[14px] md:text-[16px]  font-medium md:hover:underline underline-offset-4 decoration-2 w-fit text-[var(--darkPurple)] dark:text-[var(--purple)] ${
                mxAuto ? 'mx-auto' : ''
            }`}
        >
            {children ?? (
                <>
                    <p>{slot?.toLocaleString()}</p>
                    <LinkIcon />
                </>
            )}
        </NetworkLink>
    );
};

export default LinkSlot;
