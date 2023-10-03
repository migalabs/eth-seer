import React, { useContext } from 'react';
import Link from 'next/link';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

// Components
import LinkIcon from './LinkIcon';

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
        <Link
            href={{
                pathname: '/validators/[id]',
                query: {
                    id: validator,
                },
            }}
            passHref
            as={`/validators/${validator}`}
            className={`flex gap-x-1 items-center font-medium md:hover:underline underline-offset-4 decoration-2 w-fit ${
                mxAuto ? 'mx-auto' : ''
            }`}
            style={baseStyle}
        >
            {children ?? (
                <>
                    <p>{validator?.toLocaleString()}</p>
                    <LinkIcon />
                </>
            )}
        </Link>
    );
};

export default LinkValidator;
