import React, { useState, useEffect } from 'react';

// Props
type Props = {
    title: string;
    countdownTime: number;
};

const CountdownBanner = ({ title, countdownTime }: Props) => {
    // State
    const [days, setDays] = useState('00');
    const [hours, setHours] = useState('00');
    const [minutes, setMinutes] = useState('00');
    const [seconds, setSeconds] = useState('00');
    const [showCountdown, setShowCountdown] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const diff = countdownTime - now;

            if (diff < 0) {
                setDays('00');
                setHours('00');
                setMinutes('00');
                setSeconds('00');

                const days = Math.abs(diff / (1000 * 60 * 60 * 24));

                if (days < 2) {
                    setShowCountdown(true);
                } else {
                    setShowCountdown(false);
                    clearInterval(interval);
                }

                return;
            }

            setShowCountdown(true);

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setDays(days.toString().padStart(2, '0'));
            setHours(hours.toString().padStart(2, '0'));
            setMinutes(minutes.toString().padStart(2, '0'));
            setSeconds(seconds.toString().padStart(2, '0'));
        }, 1000);

        return () => clearInterval(interval);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={`${!showCountdown ? 'hidden' : ''} bg-[var(--white50)] dark:bg-[var(--bgDarkMode)]`}>
            <div className='countdown-banner flex flex-col gap-y-4 items-center mt-12 xl:mt-0 xl:mb-10 px-6 py-4'>
                <span className='bg-white px-8 py-1 text-2xs md:text-xs rounded-sm'>Countdown to</span>

                <h3 className='font-bold text-xl md:text-3xl xl:text-5xl text-balance text-center text-black dark:text-white xs:max-w-[75%] xl:max-w-[60%]'>
                    {title}
                </h3>

                <div className='flex gap-x-8 md:gap-x-10 xl:gap-x-12 mt-2 justify-between'>
                    <div className='flex flex-col gap-y-2 items-center'>
                        <span
                            className='flex items-center justify-center text-xl md:text-3xl xl:text-5xl font-medium text-[var(--purpleDark)] bg-white w-10 md:w-12 xl:w-[72px] h-16 md:h-20 xl:h-24 border-2 border-[var(--purpleDark)]'
                            style={{ boxShadow: 'var(--boxShadowCountdown)' }}
                        >
                            {days}
                        </span>
                        <span className='text-2xs md:text-base ml-0.5 font-medium text-black dark:text-white'>
                            Days
                        </span>
                    </div>

                    <div className='flex flex-col gap-y-2 items-center'>
                        <span
                            className='flex items-center justify-center text-xl md:text-3xl xl:text-5xl font-medium text-[var(--purpleDark)] bg-white w-10 md:w-12 xl:w-[72px] h-16 md:h-20 xl:h-24 border-2 border-[var(--purpleDark)]'
                            style={{ boxShadow: 'var(--boxShadowCountdown)' }}
                        >
                            {hours}
                        </span>
                        <span className='text-2xs md:text-base ml-0.5 font-medium text-black dark:text-white'>
                            Hours
                        </span>
                    </div>

                    <div className='flex flex-col gap-y-2 items-center'>
                        <span
                            className='flex items-center justify-center text-xl md:text-3xl xl:text-5xl font-medium text-[var(--purpleDark)] bg-white w-10 md:w-12 xl:w-[72px] h-16 md:h-20 xl:h-24 border-2 border-[var(--purpleDark)]'
                            style={{ boxShadow: 'var(--boxShadowCountdown)' }}
                        >
                            {minutes}
                        </span>
                        <span className='text-2xs md:text-base ml-0.5 font-medium text-black dark:text-white'>
                            Minutes
                        </span>
                    </div>

                    <div className='flex flex-col gap-y-2 items-center'>
                        <span
                            className='flex items-center justify-center text-xl md:text-3xl xl:text-5xl font-medium text-[var(--purpleDark)] bg-white w-10 md:w-12 xl:w-[72px] h-16 md:h-20 xl:h-24 border-2 border-[var(--purpleDark)]'
                            style={{ boxShadow: 'var(--boxShadowCountdown)' }}
                        >
                            {seconds}
                        </span>
                        <span className='text-2xs md:text-base ml-0.5 font-medium text-black dark:text-white'>
                            Seconds
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CountdownBanner;
