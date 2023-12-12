import React, { useContext } from 'react';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

// Components
import LinkIcon from './LinkIcon';
import NetworkLink from './NetworkLink';

// Helpers
import { getShortAddress } from '../../helpers/addressHelper';

// Types
type Props = {
    hash: string | undefined;
    children?: React.ReactNode;
    mxAuto?: boolean;
};

const LinkTransaction = ({ hash, children, mxAuto }: Props) => {
    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) ?? {};

    const baseStyle = {
        color: themeMode?.darkMode ? 'var(--purple)' : 'var(--darkPurple)',
    };

    return (
        <NetworkLink
            href={`/transaction/${hash}`}
            passHref
            className={`flex gap-x-1 items-center text-[14px] md:text-[16px]  font-medium md:hover:underline underline-offset-4 decoration-2 w-fit ${
                mxAuto ? 'mx-auto' : ''
            }`}
            style={baseStyle}
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
