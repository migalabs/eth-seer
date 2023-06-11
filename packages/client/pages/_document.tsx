import { Html, Head, Main, NextScript } from 'next/document';
import { Global, css } from '@emotion/react';

export default function Document() {
    const assetPrefix = process.env.NEXT_PUBLIC_ASSET_PREFIX || '';

    return (
        <Html>
            <Global
                styles={css`
                    :root {
                        --headingFont: 'Press Start 2P', cursive;
                        --brown1: #ffc163;
                        --brown2: #df8736;
                        --brown3: #ae5a0c;
                        --brown4: #c57f18;
                        --brown5: #b38b02;
                        --yellow1: #fbc508;
                        --yellow2: #fff0a1;
                        --yellow3: #edbf4a;
                        --yellow4: #f0c83a;
                        --yellow5: #9a7b2d;
                        --yellow6: #fff0a1b3;
                        --orange1: #ec903c;
                        --orange2: #ffcea1;
                        --orange3: #f18d30;
                        --orange4: #ffb16866;
                        --blue1: #c6ecf8;
                        --blue2: #6cc4e0;
                        --blue3: #86d4ed;
                        --blue4: #86d4ed99;
                        --blue5: #4fc1e480;
                        --blue6: #4089a080;
                        --blue7: #0080a9;
                        --blue8: #0080a94d;
                        --blue9: #2b6d83;
                        --blue10: #209198;
                        --blue11: #c6ecf8b3;
                        --green1: #a7eed466;
                        --green2: #a7eed4;
                        --green3: #29c68e;
                        --green4: #89ebc8;
                        --purple1: #bdc4ff99;
                        --purple2: #886ed2;
                        --purple3: #bdc4ff;
                        --purple4: #886ed280;

                        --boxShadowYellow1: inset -7px -7px 8px var(--yellow3), inset 7px 7px 8px var(--yellow3);
                        --boxShadowYellow2: inset -2.8px -2.8px 3.2px var(--yellow4),
                            inset 2.8px 2.8px 3.2px var(--yellow4);
                        --boxShadowYellow3: inset -2.76px -2.76px 3.15px var(--yellow3),
                            inset 2.76px 2.76px 3.15px var(--yellow3);
                        --boxShadowOrange1: inset -7px -7px 8px var(--orange1), inset 7px 7px 8px var(--orange1);
                        --boxShadowOrange2: inset -7px -7px 8px var(--orange2), inset 7px 7px 8px var(--orange2);
                        --boxShadowOrange3: inset -4px -4px 4px var(--orange3), inset 4px 4px 4px var(--orange3);
                        --boxShadowBlue1: inset -5px -5px 4px var(--blue5), inset 5px 5px 4px var(--blue5);
                        --boxShadowBlue2: inset -5px -5px 4px var(--blue6), inset 5px 5px 4px var(--blue6);
                        --boxShadowBlue3: inset -7px -7px 8px var(--blue3), inset 7px 7px 8px var(--blue3);
                        --boxShadowBlue4: inset 4px 4px 4px var(--blue8), inset -4px -4px 4px var(--blue8);
                        --boxShadowBlue5: inset -2.76px -2.76px 3.15px var(--blue10),
                            inset 2.76px 2.76px 3.15px var(--blue10);
                        --boxShadowGreen1: inset -7px -7px 8px var(--green2), inset 7px 7px 8px var(--green2);
                        --boxShadowGreen2: inset -7px -7px 8px var(--green3), inset 7px 7px 8px var(--green3);
                        --boxShadowGreen3: inset 4px 4px 4px var(--green3), inset -4px -4px 4px var(--green3);
                        --boxShadowPurple1: inset -7px -7px 8px var(--purple2), inset 7px 7px 8px var(--purple2);
                        --boxShadowPurple2: inset -4px -4px 4px var(--purple4), inset 4px 4px 4px var(--purple4);

                        --background-image-light: url('${assetPrefix}/static/images/background-orange.svg');
                        --background-image-dark: url('${assetPrefix}/static/images/background-purple.svg');
                    }

                    html {
                        box-sizing: border-box;
                    }

                    *,
                    *:before,
                    *:after {
                        box-sizing: inherit;
                    }

                    body {
                        background-image: var(--background-image-light);
                        background-repeat: no-repeat;
                        background-size: cover;
                        background-attachment: fixed;
                        font-size: 1.6rem;
                        font-family: var(--headingFont);
                    }

                    label,
                    p {
                        margin: 0;
                    }
                `}
            />

            <Head>
                <link rel='shortcut icon' href={`${assetPrefix}/static/images/favicon.png`} />
                <link rel='preconnect' href='https://fonts.googleapis.com' />
                <link rel='preconnect' href='https://fonts.gstatic.com' />
                <link href='https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap' rel='stylesheet' />
                <meta name='twitter:card' content='summary' />
                <meta name='twitter:site' content='@miga_labs' />
                <meta name='twitter:image' content='http://ethseer.com/static/images/ethseer_metadata.png' />
                <meta property='og:url' content='http://ethseer.com/' />
                <meta property='og:title' content='Ethseer - Ethereum blockchain live data' />
                <meta
                    property='og:description'
                    content="Ethereum's network latest epochs and blocks live data and statistics are shown on Ethseer"
                />
                <meta property='og:image' content='http://ethseer.com/static/images/ethseer_metadata.png' />
                <meta httpEquiv='Content-Security-Policy' content='upgrade-insecure-requests' />
                <link href={`${assetPrefix}/static/css/theme-mode-switch.css`} rel='stylesheet' />
            </Head>

            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
