import React, { useEffect, useState } from 'react';
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
    z-index: 90;
`;

const Container = styled.div<Props>`
    display: ${props => (props.consent ? 'none' : 'block')};
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    border-radius: 0.5rem;
    border: 2px #c9b6f8 solid;
    width: 700px;
    padding: 20px;

    .buttons-container {
        display: flex;
        flex-direction: row nowrap;
        justify-content: center;
        align-items: center;
        row-gap: 5px;
        margin: 5px 0;
        column-gap: 20px;
    }

    @media (max-width: 768px) {
        width: 400px;
        .buttons-container {
            flex-direction: column;
        }
    }

    button {
        padding: 10px 20px;
        cursor: pointer;
        background-color: var(--purple);
        color: black;
        border-radius: 0.25rem;
        font-size: 16px;

        &:hover {
            background-color: var(--lightGray);
            color: white;
            transition: all 0.2s ease-in-out;
        }

        @media (max-width: 768px) {
            &:hover {
                background-color: var(--purple);
                color: black;
                transition: none;
            }
            width: 200px;
        }
    }
`;

const Overlay = styled.div<Props>`
    display: ${props => (props.consent ? 'none' : 'block')};
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.5);
    z-index: 80;
`;

const Consent = () => {
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

    if (consent === true) {
        return null;
    }

    return (
        <>
            <Overlay consent={consent} />
            <Screen consent={consent}>
                <Container consent={consent}>
                    <div className=''>
                        <div className='flex flex-col items-center md:items-start'>
                            <div className='flex flex-row justify-start items-center mb-2 gap-2'>
                                <CustomImage
                                    src='/static/images/cookies/cookie.webp'
                                    alt='Cookie'
                                    width={40}
                                    height={40}
                                    className='mx-auto'
                                />
                                <p className='capitalize font-medium text-[18px] md:text-[20px]'>cookies</p>
                            </div>
                            <p
                                className={`md:text-left text-[14px] md:text-[16px] text-center text ${
                                    generalVisisble ? 'flex' : 'hidden'
                                }`}
                            >
                                We use cookies to know how users interact with our website to deliver a better user
                                experience.
                            </p>
                        </div>
                        <div className='buttons-container'>
                            <button onClick={acceptCookie}>Only necessary</button>
                            <button onClick={acceptCookie}>Accept all cookies</button>
                        </div>
                    </div>
                </Container>
            </Screen>
        </>
    );
};

export default Consent;
