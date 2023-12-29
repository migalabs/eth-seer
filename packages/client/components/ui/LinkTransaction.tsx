import React from 'react';

// Components
import LinkIcon from './LinkIcon';
import NetworkLink from './NetworkLink';

// Helpers
import { getShortAddress } from '../../helpers/addressHelper';

// Props
type Props = {
    hash: string | undefined;
    children?: React.ReactNode;
    mxAuto?: boolean;
};

const LinkTransaction = ({ hash, children, mxAuto }: Props) => {
    return (
        <NetworkLink
            href={`/transaction/${hash}`}
            passHref
            className={`flex gap-x-1 items-center text-[14px] md:text-[16px]  font-medium md:hover:underline underline-offset-4 decoration-2 w-fit text-[var(--darkPurple)] dark:text-[var(--purple)] ${
                mxAuto ? 'mx-auto' : ''
            }`}
        >
            {children ?? (
                <>
                    <span>{getShortAddress(hash)}</span>
                    <LinkIcon />
                </>
            )}
        </NetworkLink>
    );
};

export default LinkTransaction;
