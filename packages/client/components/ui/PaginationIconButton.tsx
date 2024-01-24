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
            size='sm'
            variant='outlined'
            onClick={onClick}
            disabled={disabled}
            className='flex items-center justify-center border-2 border-[var(--black)] dark:border-[var(--white)] text-[var(--black)] dark:text-[var(--white)]'
        >
            {children}
        </IconButton>
    );
};

export default PaginationIconButton;
