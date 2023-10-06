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
};

const LinkEntity = ({ entity, children }: Props) => {
    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) ?? {};

    const baseStyle = {
        color: themeMode?.darkMode ? 'var(--purple)' : 'var(--darkPurple)',
    };
    return (
        <NetworkLink
            href={`/entity/${entity}`}
            passHref
            className='flex text-[14px] md:text-[16px] uppercase font-medium md:hover:underline underline-offset-4 decoration-2 gap-x-1 items-center w-fit mx-auto'
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
