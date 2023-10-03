import React, { useContext } from 'react';
import Link from 'next/link';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

// Components
import LinkIcon from './LinkIcon';

// Types
type Props = {
    slot: number | undefined;
    children?: React.ReactNode;
    mxAuto?: boolean;
};

const LinkSlot = ({ slot, children, mxAuto }: Props) => {
    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) ?? {};

    const baseStyle = {
        color: themeMode?.darkMode ? 'var(--purple)' : 'var(--darkPurple)',
    };

    return (
        <Link
            href={{
                pathname: '/slots/[id]',
                query: {
                    id: slot,
                },
            }}
            passHref
            as={`/slots/${slot}`}
            className={`flex gap-x-1 items-center font-medium md:hover:underline underline-offset-4 decoration-2 w-fit ${
                mxAuto ? 'mx-auto' : ''
            }`}
            style={baseStyle}
        >
            {children ?? (
                <>
                    <p>{slot?.toLocaleString()}</p>
                    <LinkIcon />
                </>
            )}
        </Link>
    );
};

export default LinkSlot;
