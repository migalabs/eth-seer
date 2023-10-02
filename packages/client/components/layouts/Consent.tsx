import React, { useEffect, useState, useRef, useContext } from 'react';
import { setCookie, hasCookie } from 'cookies-next';
import styled from '@emotion/styled';

//Context
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

// Components
import CustomImage from '../ui/CustomImage';

// Styled
type Props = {
    consent: boolean;
};

const Screen = styled.div<Props>`
    display: ${props => (props.consent ? 'none' : 'block')};
    position: absolute;
    top: 70%;
    right: 50%;
    transform: translate(-50%, -50%);
    z-index: 40;
`;

const Container = styled.div<Props>`
    display: ${props => (props.consent ? 'none' : 'block')};
    position: absolute;
    text-align: center;
    background-color: white;
    border-radius: .5rem;
    border: 2px #c9b6f8 solid;
    z-index: var(--zIndexConsent);

    .buttons-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        row-gap: 5px;
        margin: 5px 0;
    }

    button {
        padding: 10px 20px;
        cursor: pointer;
        background-color: var(--purple);
        color: black;
        border-radius: .25rem;

        &:hover {
            background-color: var(--lightGray);
            color: white;
            transition: all .2s ease-in-out;
        }
    }

    @media (min-width: 768px) {
        width: 700px;
        padding: 10px 20px;

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
    const [consent, setConsent] = useState(true);
    const [generalVisisble, setGeneralVisible] = useState(true);
    const [necessaryVisible, setNecessaryVisible] = useState(false);
    const [allVisible, setAllVisible] = useState(false);

    useEffect(() => {
        setConsent(hasCookie('localConsent'));
    }, []);

    // Theme Mode Context
    const { themeMode } = React.useContext(ThemeModeContext) ?? {};

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
        <Screen consent={consent}>
            <Container consent={consent}>
                <div>
                    <div className="flex flex-col items-start">
                        <div className="flex flex-row justify-start items-center mb-2 gap-2">
                            <CustomImage
                                    src='/static/images/cookies/cookie.webp'
                                    alt='Cookie'
                                    width={40}
                                    height={40}
                                    className='mx-auto'
                                />
                            <p className='capitalize font-medium text-[14px] md:text-[20px]'>cookies</p>
                        </div>
                        <p className={`text-left text-[12px] md:text-[16px] text ${generalVisisble ? 'flex' : 'hidden'}`}>
                            We use cookies to know how users interact with our website to deliver a better user
                            experience.
                        </p>
                    </div>
                    <div className='buttons-container'>
                        <button
                            onClick={acceptCookie}
                        >
                            Only necessary
                        </button>
                        <button
                            onClick={acceptCookie}
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
