import { Html, Head, Main, NextScript } from 'next/document';
import { Global, css } from '@emotion/react';

export default function Document() {
    return (
        <Html>
            <Global
                styles={css`
                    :root {
                        --headingFont: 'Press Start 2P', cursive;
                        --purple1: #775cb1;
                        --purple2: #e5d9ff;
                        --green1: #cfffaa;
                        --green2: #95db5e;
                        --red1: #f1a5a5;
                        --red2: #ba7272;
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
                        background: url('/static/images/background-purple.svg') no-repeat;
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
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:site" content="@miga_labs" />
                <meta property="og:url" content="http://ethseer.com/" />
                <meta property="og:title" content="Ethseer - Ethereum blockchain live data" />
                <meta property="og:description" content="Ethereum's network latest epochs and blocks live data and statistics are shown on Ethseer" />
                <meta property="og:image" content="http://ethseer.com/static/images/ethseer_metadata_image.png" />
            </Head>

            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
