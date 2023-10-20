import React, { useContext } from 'react';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

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
    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) ?? {};

    const baseStyle = {
        color: themeMode?.darkMode ? 'var(--purple)' : 'var(--darkPurple)',
    };
    return (
        <NetworkLink
            href={`/validator/${validator}`}
            passHref
            className={`flex gap-x-1 items-center font-medium md:hover:underline text-[14px] md:text-[16px] underline-offset-4 decoration-2 w-fit ${
                mxAuto ? 'md:mx-auto' : ''
            }`}
            style={baseStyle}
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
