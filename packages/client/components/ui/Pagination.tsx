import React from 'react';
import { Typography } from '@material-tailwind/react';
import {
    ArrowLeftIcon,
    ArrowRightIcon,
    ChevronDoubleLeftIcon,
    ChevronDoubleRightIcon,
} from '@heroicons/react/24/outline';

// Components
import PaginationIconButton from './PaginationIconButton';

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
        <div className='flex items-center w-11/12 xl:w-10/12 mx-auto justify-center lg:justify-start gap-x-4 mt-4 '>
            <div className='flex gap-x-2'>
                <PaginationIconButton onClick={() => onChangePage(0)} disabled={currentPage === 0}>
                    <ChevronDoubleLeftIcon strokeWidth={2} className='h-4 w-4' />
                </PaginationIconButton>

                <PaginationIconButton onClick={prev} disabled={currentPage === 0}>
                    <ArrowLeftIcon strokeWidth={2} className='h-4 w-4' />
                </PaginationIconButton>
            </div>

            <Typography className='font-normal text-[14px] md:text-[16px] text-[var(--black)] dark:text-[var(--white)] text-center'>
                Page{' '}
                <strong className='text-[var(--black)] dark:text-[var(--white)]'>
                    {(currentPage + 1).toLocaleString()}
                </strong>{' '}
                of{' '}
                <strong className='text-[var(--black)] dark:text-[var(--white)]'>{totalPages.toLocaleString()}</strong>
            </Typography>

            <div className='flex gap-x-2'>
                <PaginationIconButton onClick={next} disabled={currentPage === totalPages - 1}>
                    <ArrowRightIcon strokeWidth={2} className='h-4 w-4' />
                </PaginationIconButton>

                <PaginationIconButton
                    onClick={() => onChangePage(totalPages - 1)}
                    disabled={currentPage === totalPages - 1}
                >
                    <ChevronDoubleRightIcon strokeWidth={2} className='h-4 w-4' />
                </PaginationIconButton>
            </div>
        </div>
    );
};

export default Pagination;
