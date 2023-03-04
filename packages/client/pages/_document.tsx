import { Html, Head, Main, NextScript } from 'next/document';
import { Global, css } from '@emotion/react';

export default function Document() {
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
                        --orange1: #ec903c;
                        --blue1: #c6ecf8;
                        --blue2: #6cc4e0;
                        --blue3: #86d4ed;

                        --boxShadowYellow1: inset -7px -7px 8px var(--yellow3), inset 7px 7px 8px var(--yellow3);
                        --boxShadowOrange1: inset -7px -7px 8px var(--orange1), inset 7px 7px 8px var(--orange1);
                        --boxShadowBlue1: inset -5px -5px 4px rgba(79, 193, 228, 0.5),
                            inset 5px 5px 4px rgba(79, 193, 228, 0.5);
                        --boxShadowBlue2: inset -5px -5px 4px rgba(64, 137, 160, 0.5),
                            inset 5px 5px 4px rgba(64, 137, 160, 0.5);

                        --background-image-light: url('/static/images/background-orange.svg');
                        --background-image-dark: url('/static/images/background-purple.svg');
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
                <link rel='shortcut icon' href='/static/images/favicon.png' />
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
                <link href='/static/css/theme-mode-switch.css' rel='stylesheet' />
            </Head>

            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
