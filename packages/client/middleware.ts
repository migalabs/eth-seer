import { NextRequest, NextResponse } from 'next/server';

// Cache for the networks
let networksCache: string[] | null = null;
let defaultNetworkCache: string | null = null;

export async function fetchNetworks() {
    if (!networksCache) {
        try {
            const response = await fetch(`${process.env.API_URL}/api/networks`);
            const networksData = await response.json();
            networksCache = networksData.networks;
            if ((networksCache as string[]).length > 0) {
                defaultNetworkCache = (networksCache as string[])[0];
            }
        } catch (err) {
            console.error('Error fetching networks:', err);
        }
    }
    return { networks: networksCache, default_network: defaultNetworkCache };
}

export async function middleware(req: NextRequest) {
    const { networks, default_network } = await fetchNetworks();

    const pathsWithoutNetwork = [
        '/entity',
        '/entities',
        '/epoch',
        '/epochs',
        '/slot',
        '/slots',
        '/validator',
        '/validators',
    ];
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

    const isPathWithoutNetwork = pathsWithoutNetwork.find(item => req.nextUrl.pathname.startsWith(item));

    const hasOldPath =
        oldPathsToReplace.filter(
            item =>
                req.nextUrl.pathname.includes(`/${item.plural}/`) ||
                (req.nextUrl.pathname.endsWith(`/${item.singular}`) &&
                    !req.nextUrl.pathname.includes('graffiti') &&
                    !req.nextUrl.pathname.includes('graffitis'))
        ).length > 0;

    const replaceOldPaths = (url: string) => {
        oldPathsToReplace.forEach(item => {
            if (url.includes(`/${item.plural}/`)) {
                url = url.replace(`/${item.plural}/`, `/${item.singular}/`);
            } else if (url.endsWith(`/${item.singular}`) && !url.includes('graffiti') && !url.includes('graffitis')) {
                url = url.replace(`/${item.singular}`, `/${item.plural}`);
            }
        });

        return url;
    };

    if (isPathWithoutNetwork || req.nextUrl.pathname === '/') {
        let newUrl = `${req.nextUrl.origin}/${default_network}${req.nextUrl.pathname}`;

        if (hasOldPath) {
            newUrl = replaceOldPaths(newUrl);
        }

        return NextResponse.redirect(newUrl);
    } else if (hasOldPath) {
        return NextResponse.redirect(replaceOldPaths(req.nextUrl.href));
    } else if (!req.nextUrl.pathname.includes('_next') && !req.nextUrl.pathname.includes('static')) {
        const network = req.nextUrl.pathname.split('/')[1];

        if (!networks?.includes(network)) {
            return NextResponse.redirect(`${req.nextUrl.origin}/${default_network}`);
        }
    }

    return NextResponse.next();
}
