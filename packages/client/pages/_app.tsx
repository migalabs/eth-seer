import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Script from 'next/script';
import { getCookie } from 'cookies-next';

export default function App({ Component, pageProps }: AppProps) {
    const consent = getCookie('localConsent');

    return (
        <>
            <Component {...pageProps} />

            <Script
                id='gtag'
                strategy='afterInteractive'
                dangerouslySetInnerHTML={{
                    __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}

                    gtag('consent', 'default', {
                        'ad_storage': 'denied',
                        'analytics_storage': 'denied'
                    });

                    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                    })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_TAG_MANAGER}');`,
                }}
            />

            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
                strategy='afterInteractive'
            />

            <Script id='google-analytics' strategy='afterInteractive'>
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){window.dataLayer.push(arguments);}
                    gtag('js', new Date());

                    gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}');
				`}
            </Script>

            {consent === true && (
                <Script
                    id='consupd'
                    strategy='afterInteractive'
                    dangerouslySetInnerHTML={{
                        __html: `
                        gtag('consent', 'update', {
                            'ad_storage': 'granted',
                            'analytics_storage': 'granted'
                        });
					`,
                    }}
                />
            )}
        </>
    );
}
