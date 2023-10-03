import React, { useContext } from 'react';
import Link from 'next/link';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

// Components
import LinkIcon from './LinkIcon';

// Types
type Props = {
    epoch: number | undefined;
    children?: React.ReactNode;
    mxAuto?: boolean;
};

const LinkEpoch = ({ epoch, children, mxAuto }: Props) => {
    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) ?? {};

    const baseStyle = {
        color: themeMode?.darkMode ? 'var(--purple)' : 'var(--darkPurple)',
    };
    return (
        <Link
            href={{
                pathname: '/epochs/[id]',
                query: {
                    id: epoch,
                },
            }}
            passHref
            as={`/epochs/${epoch}`}
            className={`flex gap-x-1 items-center font-medium md:hover:underline underline-offset-4 decoration-2 w-fit ${
                mxAuto ? 'mx-auto' : ''
            }`}
            style={baseStyle}
        >
            {children ?? (
                <>
                    <p>{epoch?.toLocaleString()}</p>
                    <LinkIcon />
                </>
            )}
        </Link>
    );
};

export default LinkEpoch;
