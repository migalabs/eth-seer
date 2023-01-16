import React, { useEffect, useState, useRef } from 'react';
import { setCookie, hasCookie } from 'cookies-next';
import Image from 'next/image';
import styled from '@emotion/styled';

// Styled
type Props = {
    consent: boolean;
};

const Screen = styled.div<Props>`
    display: ${props => (props.consent ? 'none' : 'block')};
    position: absolute;
    top: 0;
    left: 0;
    width: calc(100vw - 17px);
    height: 100vh;
`;

const Container = styled.div<Props>`
    display: ${props => (props.consent ? 'none' : 'block')};
    position: absolute;
    top: calc(50% - 120px);
    left: 5%;
    height: 240px;
    width: 90vw;
    padding: 40px 5px 20px;
    text-align: center;
    background-color: var(--purple2);
    box-shadow: inset -12.6px -12.6px 25px rgba(0, 0, 0, 0.15), inset 12.6px 12.6px 25px rgba(0, 0, 0, 0.15);
    border-radius: 30px;
    z-index: 1;
    animation-duration: 1s;
    animation-name: slidein;

    @keyframes slidein {
        from {
            opacity: 0;
            transform: scale(0.8);
        }

        to {
            opacity: 1;
            transform: scale(1);
        }
    }

    p {
        font-family: var(--headingFont);
        font-style: normal;
        color: var(--purple1);
    }

    .image-container {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        top: 10px;
        left: calc(50% - 20px);
        height: 40px;
        width: 40px;
        border-radius: 50%;
        background-color: var(--purple1);
        padding: 5px;
        cursor: pointer;
    }

    .title {
        font-size: 16px;
        font-weight: 800;
        margin: 20px 0;
    }

    .description {
        font-size: 12px;
        margin-bottom: 10px;
    }

    .buttons-container {
        display: flex;
        justify-content: center;
        column-gap: 20px;
        margin: 20px 0;
    }

    button {
        box-shadow: inset 0px 0px 7px 3px rgba(0, 0, 0, 0.15);
        border-radius: 40px;
        font-size: 16px;
        text-transform: uppercase;
        font-family: var(--headingFont);
        font-style: normal;
        font-weight: 500;
        padding: 5px 10px;
        width: 170px;
        cursor: pointer;
    }

    .green {
        background: var(--green1);
        border: 3px solid var(--green2);
        color: var(--green2);
    }

    .red {
        background: var(--red1);
        border: 3px solid var(--red2);
        color: var(--red2);
    }

    @media (min-width: 768px) {
        top: calc(50% - 160px);
        left: calc(50% - 300px);
        height: 320px;
        width: 600px;
        border-radius: 70px;
        padding: 40px;

        .image-container {
            top: -55px;
            left: calc(50% - 25px);
            height: 50px;
            width: 50px;
        }

        .title {
            font-size: 30px;
        }

        .description {
            font-size: 16px;
        }
    }
`;

const Consent = () => {
    const screenRef = useRef(null);

    const [consent, setConsent] = useState(true);

    useEffect(() => {
        setConsent(hasCookie('localConsent'));
    }, []);

    const acceptCookie = () => {
        setConsent(true);
        setCookie('localConsent', 'true', { maxAge: 60 * 60 * 24 * 365 });
        gtag('consent', 'update', {
            ad_storage: 'granted',
            analytics_storage: 'granted',
        });
    };

    const handleScreenClient = (e: any) => {
        if (e.target === screenRef.current) {
            closeP();
        }
    };

    const closeP = () => {
        setConsent(true);
        setCookie('localConsent', 'false', { maxAge: 60 * 60 });
    };

    const denyCookie = () => {
        setConsent(true);
        setCookie('localConsent', 'false', { maxAge: 60 * 60 * 24 * 365 });
    };

    if (consent === true) {
        return null;
    }

    return (
        <Screen ref={screenRef} consent={consent} onClick={handleScreenClient}>
            <Container consent={consent}>
                <div className='image-container' onClick={closeP}>
                    <Image src='/static/images/cross.svg' alt='Cancel button' width={40} height={40} />
                </div>
                <p className='title'>We use cookies</p>
                <p className='description'>
                    This website uses cookies to ensure you get the best experience on our website.
                </p>

                <div className='buttons-container'>
                    <button className='green' onClick={acceptCookie}>
                        Accept
                    </button>
                    <button className='red' onClick={denyCookie}>
                        Deny
                    </button>
                </div>
            </Container>
        </Screen>
    );
};

export default Consent;
