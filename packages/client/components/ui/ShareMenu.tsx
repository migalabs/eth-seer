import React, { useState } from 'react';
import Image from 'next/image';

// Components
import TooltipContainer from './TooltipContainer';
import TooltipResponsive from './TooltipResponsive';
import ShareIcon from './ShareIcon';
import LinkIcon from './LinkIcon';

// Social Media
const socialMedia = [
    {
        icon: '/static/images/social/twitter.webp',
        text: 'Twitter',
        shareLink: 'https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}',
    },
    {
        icon: '/static/images/social/telegram.webp',
        text: 'Telegram',
        shareLink: 'https://telegram.me/share/url?url=${encodedUrl}&text=${encodedTitle}',
    },
    {
        icon: '/static/images/social/linkedin.webp',
        text: 'LinkedIn',
        shareLink: 'https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}',
    },
];

// Props
type Props = {
    type: 'block' | 'entity' | 'epoch' | 'slot' | 'transaction' | 'validator';
};

const ShareMenu = ({ type }: Props) => {
    // States
    const [copied, setCopied] = useState(false);

    const getShareUrl = (shareLink: string) => {
        if (typeof window === 'undefined')
            return null;
        const encodedUrl = window.location.href;
        const encodedTitle = `Check out this ${type} on Ethseer!`;

        const url = shareLink.replace('${encodedUrl}', encodedUrl).replace('${encodedTitle}', encodedTitle);

        return url;
    };

    const handleCopyClick = async () => {
        const encodedUrl = window.location.href;

        await navigator.clipboard.writeText(encodedUrl);
        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 750);
    };

    return (
        <TooltipContainer>
            <div className='flex gap-x-4 items-center bg-white px-4 py-2 rounded-full cursor-pointer'>
                <span className='text-sm md:text-base'>Share</span>
                <ShareIcon />
            </div>

            <TooltipResponsive
                width={225}
                content={
                    <div className='flex flex-col gap-y-4 items-center'>
                        <div className='flex flex-col gap-y-2 w-full'>
                            <span className='text-sm md:text-base'>Share this link via</span>
                            <hr />
                        </div>

                        <div className='flex justify-around gap-x-2'>
                            {socialMedia.map(item => (
                                <a
                                    key={item.text}
                                    className='p-1 border-2 border-transparent rounded-full hover:border-black dark:hover:border-white transition-all duration-300 cursor-pointer w-12 h-12'
                                    href={getShareUrl(item.shareLink)}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                >
                                    <Image src={item.icon} width={50} height={50} alt={item.text} />
                                </a>
                            ))}

                            <TooltipContainer>
                                <button
                                    className='p-1 border-2 border-transparent rounded-full hover:border-black dark:hover:border-white transition-all duration-300 cursor-pointer w-12 h-12'
                                    onClick={handleCopyClick}
                                >
                                    <div className='flex justify-center items-center bg-[var(--linkPurple)] rounded-full w-full h-full'>
                                        <LinkIcon forceLight />
                                    </div>
                                </button>

                                <TooltipResponsive
                                    width={220}
                                    content={
                                        <span className='text-2xs md:text-xs'>
                                            {copied ? 'Copied!' : 'Copy the link to your clipboard'}
                                        </span>
                                    }
                                    top='-140%'
                                    polygonRight
                                    tooltipAbove
                                    invertColors
                                />
                            </TooltipContainer>
                        </div>
                    </div>
                }
                top='120%'
                polygonRight
            />
        </TooltipContainer>
    );
};

export default ShareMenu;
