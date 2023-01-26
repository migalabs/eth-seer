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
    background-color: var(--brown1);
    box-shadow: inset 6.13061px 6.13061px 7.00641px var(--brown3), inset -6.13061px -6.13061px 7.00641px var(--brown3);
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

    .text {
        font-family: var(--headingFont);
        margin-top: 24px;
        font-size: 16px;
        text-transform: uppercase;
    }

    .buttons-container {
        display: flex;
        justify-content: center;
        column-gap: 20px;
        margin: 20px 0;
    }

    button {
        box-shadow: inset 6.13061px 6.13061px 7.00641px var(--brown3),
            inset -6.13061px -6.13061px 7.00641px var(--brown3);
        border-radius: 40px;
        font-size: 14px;
        text-transform: uppercase;
        font-family: var(--headingFont);
        font-style: normal;
        font-weight: 500;
        padding: 15px 20px;
        cursor: pointer;
        background-color: var(--brown4);
        color: white;

        &:hover {
            box-shadow: inset 6.13061px 6.13061px 7.00641px var(--brown5),
                inset -6.13061px -6.13061px 7.00641px var(--brown5);
            background-color: var(--yellow1);
        }
    }

    @media (min-width: 768px) {
        top: calc(50% - 185px);
        left: calc(50% - 350px);
        height: 370px;
        width: 700px;
        border-radius: 70px;
        padding: 30px 50px 10px;

        .image-container {
            top: -55px;
            left: calc(50% - 25px);
            height: 50px;
            width: 50px;
        }
    }
`;

const Consent = () => {
    const screenRef = useRef(null);

    const [consent, setConsent] = useState(true);
    const [generalVisisble, setGeneralVisible] = useState(true);
    const [necessaryVisible, setNecessaryVisible] = useState(false);
    const [allVisible, setAllVisible] = useState(false);

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

    const handleMouseEnterNecessary = () => {
        setGeneralVisible(false);
        setNecessaryVisible(true);
        setAllVisible(false);
    };

    const handleMouseLeave = () => {
        setGeneralVisible(true);
        setNecessaryVisible(false);
        setAllVisible(false);
    };

    const handleMouseEnterAll = () => {
        setGeneralVisible(false);
        setNecessaryVisible(false);
        setAllVisible(true);
    };

    if (consent === true) {
        return null;
    }

    return (
        <Screen ref={screenRef} consent={consent} onClick={handleScreenClient}>
            <Container consent={consent}>
                <div className='flex flex-col justify-between h-full'>
                    <div>
                        <div className={generalVisisble ? 'flex' : 'hidden'}>
                            <Image src='/static/images/pacman.svg' alt='Pacman' width={150} height={150} />

                            <div className='flex justify-around w-full'>
                                <Image src='/static/images/cookie.svg' alt='Cookie' width={50} height={50} />
                                <Image src='/static/images/cookie.svg' alt='Cookie' width={50} height={50} />
                                <Image src='/static/images/cookie.svg' alt='Cookie' width={50} height={50} />
                            </div>
                        </div>

                        <div className={`relative w-fit mx-auto ${necessaryVisible ? 'block' : 'hidden'}`}>
                            <Image src='/static/images/pacman-eating.svg' alt='Logo' width={150} height={150} />

                            <Image
                                src='/static/images/cookie-bitten-right.svg'
                                alt='Cookie bitten'
                                width={50}
                                height={50}
                                className='absolute top-11 -left-9'
                            />
                            <Image
                                src='/static/images/cookie-bitten-left.svg'
                                alt='Cookie bitten'
                                width={65}
                                height={65}
                                className='absolute top-12 -right-10'
                            />
                            <Image
                                src='/static/images/cookie-crumbs.svg'
                                alt='Cookie crumbs'
                                width={50}
                                height={50}
                                className='absolute top-28 left-0'
                            />
                        </div>

                        <div className={`relative w-fit mx-auto ${allVisible ? 'block' : 'hidden'}`}>
                            <Image src='/static/images/pacman-happy.svg' alt='Pacman happy' width={150} height={150} />

                            <Image
                                src='/static/images/heart.svg'
                                alt='Heart'
                                width={40}
                                height={40}
                                className='absolute -top-2 -left-2 rotate-6'
                            />
                            <Image
                                src='/static/images/heart.svg'
                                alt='Heart'
                                width={65}
                                height={65}
                                className='absolute top-9 -left-16 -rotate-12'
                            />
                            <Image
                                src='/static/images/heart.svg'
                                alt='Heart'
                                width={65}
                                height={65}
                                className='absolute top-0 -right-12 rotate-12'
                            />
                            <Image
                                src='/static/images/heart.svg'
                                alt='Heart'
                                width={40}
                                height={40}
                                className='absolute top-[84px] -right-10 rotate-[30deg]'
                            />
                        </div>
                    </div>

                    <div>
                        <p className={`text ${generalVisisble ? 'flex' : 'hidden'}`}>
                            We use cookies to know how users interact with our website to deliver a better user
                            experience. READ MORE.
                        </p>

                        <p className={`text ${necessaryVisible ? 'block' : 'hidden'}`}>
                            YUM! Just the necessary amount of cookies.
                        </p>

                        <p className={`text ${allVisible ? 'block' : 'hidden'}`}>
                            We care about your data. Thanks for helping us improving the user experience on our website.
                            Enjoy!
                        </p>
                    </div>

                    <div className='buttons-container'>
                        <button
                            onClick={acceptCookie}
                            onMouseEnter={handleMouseEnterNecessary}
                            onMouseLeave={handleMouseLeave}
                        >
                            Only necessary
                        </button>
                        <button onClick={denyCookie} onMouseEnter={handleMouseEnterAll} onMouseLeave={handleMouseLeave}>
                            Accept all cookies
                        </button>
                    </div>
                </div>
            </Container>
        </Screen>
    );
};

export default Consent;
