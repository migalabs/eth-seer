import React from 'react';

// Components
import LinkIcon from './LinkIcon';
import NetworkLink from './NetworkLink';

// Props
type Props = {
    block: number | undefined;
    children?: React.ReactNode;
    mxAuto?: boolean;
};

const LinkBlock = ({ block, children, mxAuto }: Props) => {
    return (
        <NetworkLink
            href={`/block/${block}`}
            passHref
            className={`flex gap-x-1 items-center text-[14px] md:text-[16px] font-medium md:hover:underline underline-offset-4 decoration-2 w-fit text-[var(--darkPurple)] dark:text-[var(--purple)] ${
                mxAuto ? 'mx-auto' : ''
            }`}
        >
            {children ?? (
                <>
                    <p>{block?.toLocaleString()}</p>
                    <LinkIcon />
                </>
            )}
        </NetworkLink>
    );
};

export default LinkBlock;
