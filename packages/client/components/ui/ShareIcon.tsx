import React, { useState } from 'react';
import Image from 'next/image';

const socialMedia = [
    {
        imgUrl: '/static/images/social/twitter.webp',
        txtAlt: 'Twitter',
    },
    {
        imgUrl: '/static/images/social/telegram.webp',
        txtAlt: 'Telegram',
    },
    {
        imgUrl: '/static/images/social/linkedin.webp',
        txtAlt: 'LinkedIn',
    },
    {
        imgUrl: '/static/images/social/discord.webp',
        txtAlt: 'Discord',
    },
];

const ShareIcon = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleShareClick = () => {
        setIsOpen(!isOpen);
    };

    const handleCloseClick = () => {
        setIsOpen(false);
    };

    return (
        <div className='relative'>
            {/* Share button */}
            <div
                className='flex flex-row items-center gap-2 bg-white px-4 py-2 rounded-full cursor-pointer'
                onClick={handleShareClick}
            >
                <span className='text-base'>Share</span>
                <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='currentColor' viewBox='0 0 16 16'>
                    <path d='M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.5 2.5 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5m-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3' />
                </svg>
            </div>

            {/* Hidden share modal */}
            {isOpen && (
                <div className='bg-white absolute top-12 right-0 p-5 rounded-md w-[350px]'>
                    <div className='flex flex-row items-center justify-between pb-2'>
                        <span className='text-base'>Share this link via</span>
                        {/* Close button */}
                        <button
                            className='p-2 bg-[var(--lightGray)] rounded-full cursor-pointer lg:hover:bg-[var(--darkGray)] transition duration-300'
                            onClick={handleCloseClick}
                        >
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                width='20'
                                height='20'
                                fill='white'
                                viewBox='0 0 16 16'
                            >
                                <path d='M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708' />
                            </svg>
                        </button>
                    </div>

                    <hr className='py-1'></hr>
                    <div className='flex flex-row justify-around py-4'>
                        {socialMedia.map((item, index) => (
                            <div
                                key={index}
                                className='xl:p-1 xl:border-2 xl:border-transparent rounded-full hover:xl:p-1 hover:xl:border-2 hover:xl:border-black transition-all duration-300 cursor-pointer'
                            >
                                <Image src={item.imgUrl} width={50} height={50} alt={item.txtAlt} />
                            </div>
                        ))}
                    </div>

                    <div className='text-base flex flex-row items-center gap-2 pt-4'>
                        Or
                        <div className='flex flex-row gap-2 items-center px-4 py-2 bg-[var(--purple)] rounded-full cursor-pointer'>
                            <span>copy the link</span>
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                width='20'
                                height='20'
                                fill='currentColor'
                                viewBox='0 0 16 16'
                            >
                                <path d='M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1 1 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4 4 0 0 1-.128-1.287z' />
                                <path d='M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243z' />
                            </svg>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShareIcon;
