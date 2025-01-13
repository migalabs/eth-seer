import React from 'react';

// Components
import LinkIcon from './LinkIcon';
import NetworkLink from './NetworkLink';

// Types
type Props = {
    entity: string | undefined;
    children?: React.ReactNode;
    mxAuto?: boolean;
};

function cleanOperatorName(entity: string | undefined) {
    if (!entity)
        return 'others';
    return entity.replace('csm_', '').replace('_lido', '');
}

const LinkEntity = ({ entity, children, mxAuto }: Props) => {
    const cleanedEntity = cleanOperatorName(entity);
    return (
        <NetworkLink
            href={`/entity/${entity || 'others'}`}
            passHref
            className={`flex gap-x-1 items-center text-[14px] md:text-[16px] font-medium md:hover:underline underline-offset-4 decoration-2 w-fit uppercase text-[var(--darkPurple)] dark:text-[var(--purple)] ${
                mxAuto ? 'mx-auto' : ''
            }`}
        >
            {children ?? (
                <>
                    <p className='break-all'>{cleanedEntity}</p>
                    <LinkIcon />
                </>
            )}
        </NetworkLink>
    );
};

export default LinkEntity;
