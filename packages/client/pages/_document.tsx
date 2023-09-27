import { Html, Head, Main, NextScript } from 'next/document';
import { Global, css } from '@emotion/react';

export default function Document() {
    const assetPrefix = process.env.NEXT_PUBLIC_ASSET_PREFIX ?? '';

    return (
        <Html>
            <Global
                styles={css`
                    :root {
                        --headingFont: 'Poppins', sans-serif;
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
                        --blue1: #fff0dd;
                        --blue2: #ffd19b;
                        --blue3: #ffce99;
                        --blue4: #ecb77b;
                        --blue5: #cd8f47;
                        --blue6: #cb8e46;
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
                        --newOrange: #000000;

                        //NEW DESIGN:

                        //COLORS:
                        --white: #ffffff;
                        --black: #000000;
                        --purple: #c9b6f8;
                        --lightGray: #a19f9f;
                        --darkGray: #6d6d6d;
                        --bgBar: #c9c9c9;
                        --bgMainLightMode: #ffffff70;
                        --bgFairLightMode: #f5f5f550;
                        --bgStrongLightMode: #bdbdbd50;
                        --bgDarkMode: #343434;
                        --bgFairDarkMode: #5b5b5b65;
                        --bgStrongDarkMode: #30303080;
                        --proposedGreen: #53945a;
                        --missedRed: #e86666;
                        --depositedOrange: #f69a2e;
                        --depositedBlue: #4caee5;
                        --exitedPurple: #a966c1;

                        //SHADOWS:
                        --boxShadowGreen: 0px 2px 4px 0px #3b503d inset;
                        --boxShadowRed: 0px 2px 4px 0px #5e2c2c inset;
                        --boxShadowOrange: 0px 2px 4px 0px #735428 inset;
                        --boxShadowBlue: 0px 2px 4px 0px #2f78a1 inset;
                        --boxShadowPurple: 0px 2px 4px 0px #512b5f inset;
                        --boxShadowCardDark: 0px 4px 4px 0px rgba(0, 0, 0, 0.5) inset;
                        --boxShadowCardLight: 0px 4px 4px 0px rgba(0, 0, 0, 0.15) inset;

                        //BACKGROUND:
                        --background-light: linear-gradient(
                            180deg,
                            rgba(192, 175, 238, 1) 0%,
                            rgba(215, 200, 255, 1) 24%,
                            rgba(216, 200, 255, 1) 52%,
                            rgba(235, 227, 255, 1) 74%,
                            rgba(253, 253, 255, 1) 100%
                        );
                        --background-dark: linear-gradient(
                            180deg,
                            rgba(203, 184, 250, 1) 0%,
                            rgba(145, 132, 179, 1) 16%,
                            rgba(103, 92, 130, 1) 38%,
                            rgba(85, 85, 85, 1) 61%,
                            rgba(52, 52, 52, 1) 87%,
                            rgba(52, 52, 52, 1) 100%
                        );

                        --boxShadowYellow1: inset -7px -7px 8px var(--yellow3), inset 7px 7px 8px var(--yellow3);
                        --boxShadowYellow2: inset -2.8px -2.8px 3.2px var(--yellow4),
                            inset 2.8px 2.8px 3.2px var(--yellow4);
                        --boxShadowYellow3: inset -2.76px -2.76px 3.15px var(--yellow3),
                            inset 2.76px 2.76px 3.15px var(--yellow3);
                        --boxShadowOrange1: inset -7px -7px 8px var(--orange1), inset 7px 7px 8px var(--orange1);
                        --boxShadowOrange2: inset -7px -7px 8px var(--orange2), inset 7px 7px 8px var(--orange2);
                        --boxShadowOrange3: inset -4px -4px 4px var(--orange3), inset 4px 4px 4px var(--orange3);
                        --boxShadowBlue1: inset -5px -5px 4px var(--blue2), inset 5px 5px 4px var(--blue2);
                        --boxShadowBlue2: inset -5px -5px 4px var(--blue6), inset 5px 5px 4px var(--blue6);
                        --boxShadowBlue3: inset -7px -7px 8px var(--blue3), inset 7px 7px 8px var(--blue3);
                        --boxShadowBlue4: inset 4px 4px 4px var(--blue4), inset -4px -4px 4px var(--blue4);
                        --boxShadowBlue5: inset -2.76px -2.76px 3.15px var(--blue6),
                            inset 2.76px 2.76px 3.15px var(--blue6);
                        --boxShadowGreen1: inset -7px -7px 8px var(--green2), inset 7px 7px 8px var(--green2);
                        --boxShadowGreen2: inset -7px -7px 8px var(--green3), inset 7px 7px 8px var(--green3);
                        --boxShadowGreen3: inset 4px 4px 4px var(--green3), inset -4px -4px 4px var(--green3);
                        --boxShadowPurple1: inset -7px -7px 8px var(--purple2), inset 7px 7px 8px var(--purple2);
                        --boxShadowPurple2: inset -4px -4px 4px var(--purple4), inset 4px 4px 4px var(--purple4);

                        --zIndexThemeModeSwitch: 5;
                        --zIndexBlockImageMissed: 10;
                        --zIndexSearchEngine: 10;
                        --zIndexNetwork: 20;
                        --zIndexTooltip: 20;
                        --zIndexConsent: 30;
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
                        background-image: var(--background-light);
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
                <link rel='shortcut icon' href={`${assetPrefix}/static/images/favicon.ico`} />
                <link rel='preconnect' href='https://fonts.googleapis.com' />
                <link rel='preconnect' href='https://fonts.gstatic.com' />
                <link
                    href='https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700;800&display=swap'
                    rel='stylesheet'
                />
                <meta
                    name='keywords'
                    content='Ethereum, Ethereum Blockchain Explorer, Ethereum Block Explorer, Search'
                />
                <meta name='twitter:card' content='summary' />
                <meta name='twitter:site' content='@miga_labs' />
                <meta name='twitter:image' content='http://ethseer.io/static/images/ethseer_metadata.png' />
                <meta property='og:url' content='http://ethseer.io/' />
                <meta property='og:title' content='Ethereum Blockchain Explorer - EthSeer.io' />
                <meta property='og:image' content='http://ethseer.io/static/images/ethseer_metadata.png' />
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
