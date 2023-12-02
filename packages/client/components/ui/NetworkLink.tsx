import React, { CSSProperties } from 'react';
import { useRouter } from 'next/router';
import Link, { LinkProps } from 'next/link';

// Types
type Props = LinkProps & {
    children: React.ReactNode;
    style?: CSSProperties;
    className?: string;
};

const NetworkLink = ({ children, href, ...rest }: Props) => {
    // Router
    const router = useRouter();
    const { network } = router.query;

    let adjustedHref = href;

    if (typeof href === 'string') {
        adjustedHref = network ? `${href}?network=${network}` : href;
    } else if (typeof href === 'object' && href.pathname) {
        adjustedHref = {
            ...href,
            pathname: network ? `${href.pathname}?network=${network}` : href.pathname,
        };
    }

    return (
        <Link href={adjustedHref} prefetch={false} {...rest}>
            {children}
        </Link>
    );
};

export default NetworkLink;
