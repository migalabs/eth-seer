import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

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
    // Router
    const router = useRouter();

    // States
    const [copied, setCopied] = useState(false);

    const getShareUrl = (shareLink: string) => {
        const encodedUrl = `${process.env.NEXT_PUBLIC_URL_API}${router.asPath}`;
        const encodedTitle = `Check out this ${type} on Ethseer!`;

        const url = shareLink.replace('${encodedUrl}', encodedUrl).replace('${encodedTitle}', encodedTitle);

        return url;
    };

    const handleCopyClick = async () => {
        const encodedUrl = `${process.env.NEXT_PUBLIC_URL_API}${router.asPath}`;

        await navigator.clipboard.writeText(encodedUrl);
        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 250);
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
                                    className='p-1 border-2 border-transparent rounded-full hover:border-black dark:hover:border-white transition-all duration-300 cursor-pointer'
                                    href={getShareUrl(item.shareLink)}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                >
                                    <Image src={item.icon} width={50} height={50} alt={item.text} />
                                </a>
                            ))}
                        </div>

                        <div className='text-sm md:text-base flex items-center gap-2'>
                            <span>Or</span>
                            <button
                                className='flex gap-2 items-center px-4 py-2 bg-[var(--purple)] dark:bg-white rounded-full cursor-pointer'
                                onClick={handleCopyClick}
                            >
                                <span className='text-white dark:text-black'>copy the link</span>
                                <LinkIcon />
                            </button>
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
