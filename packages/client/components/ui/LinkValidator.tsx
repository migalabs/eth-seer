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
<<<<<<< HEAD
            as={`/validators/${validator}`}
            className={`flex gap-x-1 items-center font-medium md:hover:underline underline-offset-4 decoration-2 w-fit ${
                mxAuto ? 'mx-auto' : ''
            }`}
            style={baseStyle}
=======
            className={`flex gap-x-1 items-center w-fit ${mxAuto ? 'mx-auto' : ''}`}
>>>>>>> ea71594 (Create [network] folder and adapt all next/Link)
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
