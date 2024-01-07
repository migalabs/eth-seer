import React, { ReactNode } from 'react';

// Props
type CardProps = {
    title: string;
    text?: string;
    content?: ReactNode;
};

const Card = ({ title, text, content }: CardProps) => {
    return (
        <div className='flex flex-row items-center justify-between gap-5 md:gap-20'>
            <span className='text-[14px] md:text-[16px] font-medium text-[var(--black)] dark:text-[var(--white)]'>
                {title}:
            </span>

            {text && (
                <span className='uppercase text-[14px] md:text-[16px] font-medium text-[var(--black)] dark:text-[var(--white)] text-end'>
                    {text}
                </span>
            )}

            {content && <>{content}</>}
        </div>
    );
};

export default Card;
