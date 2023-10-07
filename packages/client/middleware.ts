import { NextRequest, NextResponse } from 'next/server';

// Constants
import { DEFAULT_NETWORK, NETWORKS } from './constants';

export function middleware(req: NextRequest) {
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
        let newUrl = `${req.nextUrl.origin}/${DEFAULT_NETWORK}${req.nextUrl.pathname}`;

        if (hasOldPath) {
            newUrl = replaceOldPaths(newUrl);
        }

        return NextResponse.redirect(newUrl);
    } else if (hasOldPath) {
        return NextResponse.redirect(replaceOldPaths(req.nextUrl.href));
    } else if (!req.nextUrl.pathname.includes('_next') && !req.nextUrl.pathname.includes('static')) {
        const network = req.nextUrl.pathname.split('/')[1];

        if (!NETWORKS.includes(network)) {
            return NextResponse.redirect(`${req.nextUrl.origin}/${DEFAULT_NETWORK}`);
        }
    }

    return NextResponse.next();
}
