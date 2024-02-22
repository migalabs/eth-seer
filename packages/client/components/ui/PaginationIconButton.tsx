import React, { ReactNode } from 'react';
import { IconButton } from '@material-tailwind/react';

// Props
type Props = {
    disabled: boolean;
    children: ReactNode;
    onClick: () => void;
};

const PaginationIconButton = ({ disabled, children, onClick }: Props) => {
    return (
        <IconButton
            variant='outlined'
            onClick={onClick}
            disabled={disabled}
            className='flex items-center justify-center border-2 border-[var(--black)] dark:border-[var(--white)] text-[var(--black)] dark:text-[var(--white)] w-7 h-7 md:w-8 md:h-8 rounded-md'
        >
            {children}
        </IconButton>
    );
};

export default PaginationIconButton;
