import { Html, Head, Main, NextScript } from 'next/document';
import { Global, css } from '@emotion/react';

export default function Document() {
    return (
        <Html>
            <Global
                styles={css`
                    :root {
                        --headingFont: 'Poppins', sans-serif;

                        //COLORS:
                        --white: #ffffff;
                        --black: #000000;
                        --purple: #c9b6f8;
                        --darkPurple: #40467d;
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
                        --backgroundLight: linear-gradient(
                            180deg,
                            rgba(192, 175, 238, 1) 0%,
                            rgba(215, 200, 255, 1) 24%,
                            rgba(216, 200, 255, 1) 52%,
                            rgba(235, 227, 255, 1) 74%,
                            rgba(253, 253, 255, 1) 100%
                        );
                        --backgroundDark: linear-gradient(
                            180deg,
                            rgba(169, 154, 207, 1) 0%,
                            rgba(121, 107, 156, 1) 16%,
                            rgba(78, 67, 103, 1) 38%,
                            rgba(54, 45, 74, 1) 61%,
                            rgba(35, 28, 51, 1) 87%,
                            rgba(0, 0, 0, 1) 100%
                        );

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
                        background-image: var(--backgroundLight);
                        background-repeat: no-repeat;
                        background-size: cover;
                        background-attachment: scroll;
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
                <link rel='shortcut icon' href='/static/images/favicon.ico' />
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
                <link href='/static/css/theme-mode-switch.css' rel='stylesheet' />
            </Head>

            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
