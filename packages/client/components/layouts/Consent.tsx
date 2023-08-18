import React, { useEffect, useState, useRef } from 'react';
import { setCookie, hasCookie } from 'cookies-next';
import styled from '@emotion/styled';

// Components
import CustomImage from '../ui/CustomImage';

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
    top: calc(50% - 175px);
    left: 2.7%;
    height: 350px;
    width: 100%;
    padding: 10px 20px;
    text-align: center;
    background-color: var(--brown1);
    box-shadow: inset 3px 3px 5px var(--brown3), inset -3px -3px 5px var(--brown3);
    border-radius: 1.5rem;
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
        font-size: 12px;
    }

    .buttons-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        row-gap: 5px;
        margin: 10px 0;
    }

    button {
        box-shadow: inset 3px 3px 5px var(--brown3), inset -3px -3px 5px var(--brown3);
        border-radius: 40px;
        font-size: 10px;
        text-transform: uppercase;
        font-family: var(--headingFont);
        font-style: normal;
        font-weight: 500;
        padding: 15px 20px;
        cursor: pointer;
        background-color: var(--brown4);
        color: white;

        &:hover {
            box-shadow: inset 3px 3px 5px var(--brown5), inset -3px -3px 5px var(--brown5);
            background-color: var(--yellow1);
        }
    }

    @media (min-width: 768px) {
        top: calc(50% - 185px);
        left: calc(50% - 350px);
        height: 370px;
        width: 700px;
        padding: 20px 50px;

        .text {
            font-size: 16px;
        }

        .buttons-container {
            flex-direction: row;
            justify-content: center;
            column-gap: 20px;
        }

        button {
            font-size: 14px;
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
                            <CustomImage
                                src='/static/images/cookies/cookies.webp'
                                alt='Pacman on its way to eat and accept some cookies'
                                width={400}
                                height={400}
                                className='mx-auto'
                            />
                        </div>
                        <div className={`relative ${necessaryVisible ? 'block' : 'hidden'}`}>
                            <CustomImage
                                src='/static/images/cookies/necessary_cookies.webp'
                                alt='Pacman eating the necessary amount of cookies '
                                width={180}
                                height={180}
                                className='mx-auto'
                            />
                        </div>
                        <div className={`relative ${allVisible ? 'block' : 'hidden'}`}>
                            <CustomImage
                                src='/static/images/cookies/all_cookies.webp'
                                alt='Happy pacman accepting all cookies'
                                width={180}
                                height={180}
                                className='mx-auto'
                            />
                        </div>
                    </div>

                    <div>
                        <p className={`text ${generalVisisble ? 'flex' : 'hidden'}`}>
                            We use cookies to know how users interact with our website to deliver a better user
                            experience.
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
                        <button
                            onClick={acceptCookie}
                            onMouseEnter={handleMouseEnterAll}
                            onMouseLeave={handleMouseLeave}
                        >
                            Accept all cookies
                        </button>
                    </div>
                </div>
            </Container>
        </Screen>
    );
};

export default Consent;
