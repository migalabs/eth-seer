import { NextRequest, NextResponse } from 'next/server';

export async function fetchNetworks(): Promise<{ networks: string[]; defaultNetwork: string | null }> {
    try {
        const response = await fetch(`${process.env.URL_API}/api/networks`);
        const networksData = await response.json();
        
        return {
            networks: networksData.networks,
            defaultNetwork: networksData.networks ? networksData.networks[0] : null,
        };

    } catch (err) {
        console.error('Error fetching networks:', err);
        throw new Error('Error fetching networks');
    }
}

export async function middleware(req: NextRequest) {

    if (req.nextUrl.pathname.includes('_next') || req.nextUrl.pathname.includes('static'))
        return NextResponse.next();

    const { networks, defaultNetwork } = await fetchNetworks();

    const oldPathsToReplace = [
        {
            singular: 'entity',
            plural: 'entities',
        },
        {
            singular: 'epoch',
            plural: 'epochs',
        },
        {
            singular: 'slot',
            plural: 'slots',
        },
        {
            singular: 'validator',
            plural: 'validators',
        },
        {
            singular: 'graffiti',
            plural: 'graffitis',
        },
    ];

    let network = req.nextUrl.searchParams.get('network');

    const networkInsidePath = networks?.find(item => req.nextUrl.pathname.includes(`/${item}/`));

    let mustRedirect = false;

    if (networkInsidePath) {
        network = networkInsidePath;
        req.nextUrl.pathname = req.nextUrl.pathname.replace(`/${network}/`, '/');
        req.nextUrl.searchParams.set('network', network);
        mustRedirect = true;
    }

    const hasOldPath =
        oldPathsToReplace.filter(
            item =>
                req.nextUrl.pathname.includes(`/${item.plural}/`) ||
                (req.nextUrl.pathname.endsWith(`/${item.singular}`) &&
                    !req.nextUrl.pathname.includes('graffiti') &&
                    !req.nextUrl.pathname.includes('graffitis'))
        ).length > 0;

    const replaceOldPaths = (pathname: string) => {
        oldPathsToReplace.forEach(item => {
            if (pathname.includes(`/${item.plural}/`)) {
                pathname = pathname.replace(`/${item.plural}/`, `/${item.singular}/`);
            } else if (pathname.endsWith(`/${item.singular}`) && !pathname.includes('graffiti') && !pathname.includes('graffitis')) {
                pathname = pathname.replace(`/${item.singular}`, `/${item.plural}`);
            }
        });

        return pathname;
    };

    if (!network || !networks?.includes(network)) {
        req.nextUrl.searchParams.set('network', defaultNetwork as string);

        if (hasOldPath) {
            req.nextUrl.pathname = replaceOldPaths(req.nextUrl.pathname);
        }

        return NextResponse.redirect(req.nextUrl);
    } else if (hasOldPath) {
        req.nextUrl.pathname = replaceOldPaths(req.nextUrl.pathname);
        return NextResponse.redirect(req.nextUrl);
    } else if (mustRedirect) {
        return NextResponse.redirect(req.nextUrl);
    }

    return NextResponse.next();
}
