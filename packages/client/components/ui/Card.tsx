import React, { ReactNode } from 'react';

// Props
type CardProps = {
    title: string;
    text?: string;
    content?: ReactNode;
};

const Card = ({ title, text, content }: CardProps) => {
    return (
        <div className='flex flex-row items-center gap-30 md:gap-30 sm:gap-x-5 text-[14px] md:text-[16px] font-medium text-[var(--black)] dark:text-[var(--white)]'>
            <span className="w-40 sm:w-40">{title}:</span>

            {text && <span className='uppercase text-end'>{text}</span>}

            {content && <>{content}</>}
        </div>
    );
};

export default Card;
