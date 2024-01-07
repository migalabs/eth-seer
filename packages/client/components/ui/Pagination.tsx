import React from 'react';
import { IconButton, Typography } from '@material-tailwind/react';
import { ArrowRightIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

// Props
type Props = {
    currentPage: number;
    totalPages: number;
    onChangePage: (newPage: number) => void;
};

const Pagination = ({ currentPage, totalPages, onChangePage }: Props) => {
    const next = () => {
        if (currentPage < totalPages) {
            onChangePage(currentPage + 1);
        }
    };

    const prev = () => {
        if (currentPage > 0) {
            onChangePage(currentPage - 1);
        }
    };

    return (
        <div className='flex items-center w-11/12 lg:w-10/12 mx-auto justify-center lg:justify-start gap-10 mt-4 '>
            <IconButton
                size='sm'
                variant='outlined'
                onClick={prev}
                disabled={currentPage === 0}
                className='flex items-center justify-center border-2 border-[var(--black)] dark:border-[var(--white)] text-[var(--black)] dark:text-[var(--white)]'
            >
                <ArrowLeftIcon strokeWidth={2} className='h-4 w-4' />
            </IconButton>

            <Typography className='font-normal text-[14px] md:text-[16px] text-[var(--black)] dark:text-[var(--white)]'>
                Page{' '}
                <strong className='text-[var(--black)] dark:text-[var(--white)]'>
                    {(currentPage + 1).toLocaleString()}
                </strong>{' '}
                of{' '}
                <strong className='text-[var(--black)] dark:text-[var(--white)]'>{totalPages.toLocaleString()}</strong>
            </Typography>

            <IconButton
                size='sm'
                variant='outlined'
                onClick={next}
                disabled={currentPage === totalPages - 1}
                className='flex items-center justify-center border-2 border-[var(--black)] dark:border-[var(--white)] text-[var(--black)] dark:text-[var(--white)]'
            >
                <ArrowRightIcon strokeWidth={2} className='h-4 w-4' />
            </IconButton>
        </div>
    );
};

export default Pagination;
