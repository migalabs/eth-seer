import { Html, Head, Main, NextScript } from 'next/document';
import { Global, css } from '@emotion/react';

export default function Document() {
    return (
        <Html>
            <Global
                styles={css`
                    :root {
                        --headingFont: 'Press Start 2P', cursive;
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
            </Head>

            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
