import React, { ReactNode } from 'react';

// Props
type Props = {
    children: ReactNode;
    className?: string;
    removeMarginTop?: boolean;
};

const Title = ({ children, className, removeMarginTop }: Props) => {
    return (
        <h1
            className={`text-center font-semibold text-[32px] md:text-[50px] text-[var(--black)] dark:text-[var(--white)] ${
                className ?? ''
            } ${removeMarginTop ? '' : 'mt-10 xl:mt-0'}`}
        >
            {children}
        </h1>
    );
};

export default Title;
