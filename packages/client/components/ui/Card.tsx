import React, { useContext, ReactNode } from 'react';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

// Props
type CardProps = {
    title: string;
    text?: string;
    content?: ReactNode;
};

const Card = ({ title, text, content }: CardProps) => {
    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) ?? {};

    return (
        <div className='flex flex-row items-center justify-between gap-5 md:gap-20'>
            <span
                className='text-[14px] md:text-[16px] font-medium'
                style={{
                    color: themeMode?.darkMode ? 'var(--white)' : 'var(--black)',
                }}
            >
                {title}:
            </span>

            {text && (
                <span
                    className={'uppercase text-[14px] md:text-[16px] font-medium'}
                    style={{
                        color: themeMode?.darkMode ? 'var(--white)' : 'var(--black)',
                    }}
                >
                    {text}
                </span>
            )}

            {content && <>{content}</>}
        </div>
    );
};

export default Card;
