import React from 'react';

// Components
import LinkIcon from './LinkIcon';
import NetworkLink from './NetworkLink';

// Types
type Props = {
    validator: number | undefined;
    children?: React.ReactNode;
    mxAuto?: boolean;
};

const LinkValidator = ({ validator, children, mxAuto }: Props) => {
    return (
        <NetworkLink
            href={`/validator/${validator}`}
            passHref
            className={`flex gap-x-1 items-center font-medium md:hover:underline text-[14px] md:text-[16px] underline-offset-4 decoration-2 w-fit text-[var(--darkPurple)] dark:text-[var(--purple)] ${
                mxAuto ? 'md:mx-auto' : ''
            }`}
        >
            {children ?? (
                <>
                    <p>{validator?.toLocaleString()}</p>
                    <LinkIcon />
                </>
            )}
        </NetworkLink>
    );
};

export default LinkValidator;
