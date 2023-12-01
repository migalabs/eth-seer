import React, { useState, useEffect, useContext, useRef } from 'react';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

// Components
import TooltipContainer from '../../components/ui/TooltipContainer';
import TooltipResponsive from '../../components/ui/TooltipResponsive';
import CustomImage from '../ui/CustomImage';
import Loader from '../ui/Loader';

// Helpers
import { getShortAddress } from '../../helpers/addressHelper';
import { getTimeAgo } from '../../helpers/timeHelper';

// Types
import { Transaction } from '../../types';

// Props
type Props = {
    transactions: Transaction[];
    loadingTransactions: boolean;
};

const Transactions = ({ transactions, loadingTransactions }: Props) => {
    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) ?? {};

    // Refs
    const containerRef = useRef<HTMLInputElement>(null);

    // States
    const [desktopView, setDesktopView] = useState(true);

    useEffect(() => {
        setDesktopView(window !== undefined && window.innerWidth > 768);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Function to handle the Mouse Move event
    const handleMouseMove = (e: any) => {
        if (containerRef.current) {
            const x = e.pageX;
            const limit = 0.15;

            if (x < containerRef.current.clientWidth * limit) {
                containerRef.current.scrollLeft -= 10;
            } else if (x > containerRef.current.clientWidth * (1 - limit)) {
                containerRef.current.scrollLeft += 10;
            }
        }
    };

    //Transactions tab - table desktop
    const getTransactionsDesktop = () => {
        return (
            <div
                ref={containerRef}
                className='flex flex-col overflow-x-scroll overflow-y-hidden scrollbar-thin w-11/12 xl:w-10/12 mx-auto mt-4'
                onMouseMove={handleMouseMove}
            >
                <div
                    className='flex gap-x-4 justify-around px-4 xl:px-8 font-semibold py-3 text-[16px] text-center min-w-[1130px]'
                    style={{
                        color: themeMode?.darkMode ? 'var(--white)' : 'var(--darkGray)',
                    }}
                >
                    <div className='flex items-center gap-x-1 justify-center w-[calc(16.667%-20px)]'>
                        <p className='mt-0.5 font-semibold'>Txn Hash</p>
                        <TooltipContainer>
                            <CustomImage
                                src='/static/images/icons/information_icon.webp'
                                alt='Time information'
                                width={24}
                                height={24}
                            />

                            <TooltipResponsive
                                width={220}
                                backgroundColor='white'
                                colorLetter='black'
                                content={<span>The hash of the transaction</span>}
                                top='34px'
                                polygonLeft
                            />
                        </TooltipContainer>
                    </div>
                    <div className='flex items-center gap-x-1 justify-center w-[calc(16.667%-20px)]'>
                        <p className='mt-0.5 font-semibold'>Age</p>
                        <TooltipContainer>
                            <CustomImage
                                src='/static/images/icons/information_icon.webp'
                                alt='Time information'
                                width={24}
                                height={24}
                            />

                            <TooltipResponsive
                                width={220}
                                backgroundColor='white'
                                colorLetter='black'
                                content={
                                    <>
                                        <span>How long ago</span>
                                        <span>the transaction passed</span>
                                    </>
                                }
                                top='34px'
                            />
                        </TooltipContainer>
                    </div>
                    <p className='mt-0.5 w-[calc(16.667%-20px)]'>From</p>
                    <div className='w-5' />
                    <p className='mt-0.5 w-[calc(16.667%-20px)]'>To</p>
                    <div className='flex items-center gap-x-1 justify-center w-[calc(16.667%-20px)]'>
                        <p className='mt-0.5 font-semibold'>Value</p>
                        <TooltipContainer>
                            <CustomImage
                                src='/static/images/icons/information_icon.webp'
                                alt='Time information'
                                width={24}
                                height={24}
                            />

                            <TooltipResponsive
                                width={220}
                                backgroundColor='white'
                                colorLetter='black'
                                content={
                                    <>
                                        <span>How much ETH</span>
                                        <span>was sent</span>
                                        <span>in the transaction</span>
                                    </>
                                }
                                top='34px'
                            />
                        </TooltipContainer>
                    </div>
                    <div className='flex items-center gap-x-1 justify-center w-[calc(16.667%-20px)]'>
                        <p className='mt-0.5 font-semibold'>Txn Fee</p>
                        <TooltipContainer>
                            <CustomImage
                                src='/static/images/icons/information_icon.webp'
                                alt='Time information'
                                width={24}
                                height={24}
                            />

                            <TooltipResponsive
                                width={220}
                                backgroundColor='white'
                                colorLetter='black'
                                content={
                                    <>
                                        <span>The fee </span>
                                        <span>the transaction cost</span>
                                    </>
                                }
                                top='34px'
                                polygonRight
                            />
                        </TooltipContainer>
                    </div>
                </div>

                <div
                    className='font-medium flex flex-col gap-y-2 text-[16px] rounded-md border-2 border-white px-4 xl:px-8 py-3 min-w-[1130px]'
                    style={{
                        backgroundColor: themeMode?.darkMode ? 'var(--bgFairDarkMode)' : 'var(--bgMainLightMode)',
                        boxShadow: themeMode?.darkMode ? 'var(--boxShadowCardDark)' : 'var(--boxShadowCardLight)',
                        color: themeMode?.darkMode ? 'var(--white)' : 'var(--black)',
                    }}
                >
                    {transactions.map(element => (
                        <div
                            className='flex justify-around gap-x-4 py-1 uppercase text-center items-center'
                            key={element.f_hash}
                        >
                            <div className='w-[calc(16.667%-20px)]'>
                                <p>{getShortAddress(element?.f_hash)}</p>
                            </div>

                            <p className='w-[calc(16.667%-20px)] lowercase'>{getTimeAgo(element.f_timestamp * 1000)}</p>

                            <p className='w-[calc(16.667%-20px)]'>{getShortAddress(element.f_from)}</p>

                            <div className='w-5'>
                                <CustomImage
                                    src={`/static/images/icons/send_${themeMode?.darkMode ? 'dark' : 'light'}.webp`}
                                    alt='Send icon'
                                    width={20}
                                    height={20}
                                />
                            </div>

                            <p className='w-[calc(16.667%-20px)]'>{getShortAddress(element.f_to)}</p>

                            <p className='w-[calc(16.667%-20px)]'>
                                {(element.f_value / 10 ** 18).toLocaleString()} ETH
                            </p>
                            <p className='w-[calc(16.667%-20px)]'>
                                {(element.f_gas_fee_cap / 10 ** 12).toLocaleString()} GWEI
                            </p>
                        </div>
                    ))}

                    {!loadingTransactions && transactions.length === 0 && (
                        <div className='flex justify-center p-2'>
                            <p className='uppercase text-[14px] md:text-[16px]'>No transactions</p>
                        </div>
                    )}
                </div>

                {loadingTransactions && (
                    <div className='mt-6'>
                        <Loader />
                    </div>
                )}
            </div>
        );
    };

    //Transactions tab - table mobile
    const getTransactionsMobile = () => {
        return (
            <div
                ref={containerRef}
                className='my-2 flex flex-col gap-2 font-medium text-[12px] w-11/12 mx-auto'
                style={{
                    color: themeMode?.darkMode ? 'var(--white)' : 'var(--black)',
                }}
                onMouseMove={handleMouseMove}
            >
                <div>
                    {transactions.map(element => (
                        <div
                            className='flex my-2 flex-col gap-y-2 text-[14px] py-4 px-14 border-2 border-white rounded-md'
                            style={{
                                backgroundColor: themeMode?.darkMode
                                    ? 'var(--bgFairDarkMode)'
                                    : 'var(--bgMainLightMode)',
                                boxShadow: themeMode?.darkMode
                                    ? 'var(--boxShadowCardDark)'
                                    : 'var(--boxShadowCardLight)',
                                color: themeMode?.darkMode ? 'var(--white)' : 'var(--black)',
                            }}
                            key={element.f_hash}
                        >
                            <div className='flex flex-row items-center justify-between'>
                                <p
                                    className='font-semibold'
                                    style={{
                                        color: themeMode?.darkMode ? 'var(--white)' : 'var(--darkGray)',
                                    }}
                                >
                                    Txn Hash
                                </p>
                                <p>{getShortAddress(element?.f_hash)}</p>
                            </div>
                            <div className='flex flex-row items-center justify-between'>
                                <p
                                    className='font-semibold'
                                    style={{
                                        color: themeMode?.darkMode ? 'var(--white)' : 'var(--darkGray)',
                                    }}
                                >
                                    Age
                                </p>
                                <p>{getTimeAgo(element.f_timestamp * 1000)}</p>
                            </div>
                            <div className='flex flex-row justify-between items-center'>
                                <p
                                    className='font-semibold'
                                    style={{
                                        color: themeMode?.darkMode ? 'var(--white)' : 'var(--darkGray)',
                                    }}
                                >
                                    From
                                </p>
                                <p
                                    className='font-semibold'
                                    style={{
                                        color: themeMode?.darkMode ? 'var(--white)' : 'var(--darkGray)',
                                    }}
                                >
                                    To
                                </p>
                            </div>
                            <div className='flex flex-row justify-between items-center'>
                                <div className='flex flex-row items-center justify-between'>
                                    <p>{getShortAddress(element?.f_from)}</p>
                                </div>
                                <CustomImage
                                    src={`/static/images/icons/send_${themeMode?.darkMode ? 'dark' : 'light'}.webp`}
                                    alt='Send icon'
                                    width={20}
                                    height={20}
                                />
                                <div className='flex flex-row items-center justify-between'>
                                    <p>{getShortAddress(element?.f_to)}</p>
                                </div>
                            </div>
                            <div className='flex flex-row items-center justify-between'>
                                <p
                                    className='font-semibold'
                                    style={{
                                        color: themeMode?.darkMode ? 'var(--white)' : 'var(--darkGray)',
                                    }}
                                >
                                    Value
                                </p>
                                <p>{(element.f_value / 10 ** 18).toLocaleString()} ETH</p>
                            </div>
                            <div className='flex flex-row items-center justify-between'>
                                <p
                                    className='font-semibold'
                                    style={{
                                        color: themeMode?.darkMode ? 'var(--white)' : 'var(--darkGray)',
                                    }}
                                >
                                    Txn Fee
                                </p>
                                <p>{(element.f_gas_fee_cap / 10 ** 12).toLocaleString()} GWEI</p>
                            </div>
                        </div>
                    ))}

                    {!loadingTransactions && transactions.length === 0 && (
                        <div
                            className='flex mt-2 justify-center rounded-md border-2 border-white px-4 py-4'
                            style={{
                                backgroundColor: themeMode?.darkMode
                                    ? 'var(--bgFairDarkMode)'
                                    : 'var(--bgMainLightMode)',
                                boxShadow: themeMode?.darkMode
                                    ? 'var(--boxShadowCardDark)'
                                    : 'var(--boxShadowCardLight)',
                                color: themeMode?.darkMode ? 'var(--white)' : 'var(--black)',
                            }}
                        >
                            <p className='uppercase text-[14px]'>No transactions</p>
                        </div>
                    )}
                </div>

                {loadingTransactions && (
                    <div className='mt-6'>
                        <Loader />
                    </div>
                )}
            </div>
        );
    };

    return <>{desktopView ? getTransactionsDesktop() : getTransactionsMobile()}</>;
};

export default Transactions;
