import React, { useContext } from 'react';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

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
    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) ?? {};

    const baseStyle = {
        color: themeMode?.darkMode ? 'var(--purple)' : 'var(--darkPurple)',
    };
    return (
        <NetworkLink
            href={`/entity/${entity}`}
            passHref
            className={`flex gap-x-1 items-center text-[14px] md:text-[16px] font-medium md:hover:underline underline-offset-4 decoration-2 w-fit uppercase ${
                mxAuto ? 'mx-auto' : ''
            }`}
            style={baseStyle}
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
