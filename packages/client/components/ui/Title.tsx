import React, { ReactNode } from 'react';

// Props
type Props = {
    children: ReactNode;
    className?: string;
};

const Title = ({ children, className }: Props) => {
    return (
        <h1
            className={`text-center mt-10 xl:mt-0 font-semibold text-[32px] md:text-[50px] text-[var(--black)] dark:text-[var(--white)] ${
                className ?? ''
            }`}
        >
            {children}
        </h1>
    );
};

export default Title;
