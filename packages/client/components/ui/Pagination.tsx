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
    fullWidth?: boolean;
    onChangePage: (newPage: number) => void;
    onChangeNumRows: (numRows: number) => void;
};

const Pagination = ({ currentPage, totalPages, fullWidth, onChangePage, onChangeNumRows }: Props) => {
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
        <div
            className={`flex flex-row sm:flex-row-reverse items-center mx-auto justify-start sm:justify-end gap-x-2 md:gap-x-8 gap-y-4 ${
                fullWidth ? 'w-full' : 'w-11/12 xl:w-10/12'
            }`}
        >
            <div className='flex items-center gap-x-2 sm:gap-x-4'>
                <div className='flex gap-x-2'>
                    <PaginationIconButton onClick={() => onChangePage(0)} disabled={currentPage === 0}>
                        <ChevronDoubleLeftIcon strokeWidth={2} className='h-3 w-3 sm:h-4 sm:w-4' />
                    </PaginationIconButton>

                    <PaginationIconButton onClick={prev} disabled={currentPage === 0}>
                        <ArrowLeftIcon strokeWidth={2} className='h-3 w-3 sm:h-4 sm:w-4' />
                    </PaginationIconButton>
                </div>

                <Typography className='flex gap-x-1 font-normal text-[14px] md:text-[16px] text-[var(--black)] dark:text-[var(--white)] text-center'>
                    <span className='hidden sm:block'>Page</span>{' '}
                    <strong className='text-[var(--black)] dark:text-[var(--white)]'>
                        {(currentPage + 1).toLocaleString()}
                    </strong>{' '}
                    of{' '}
                    <strong className='text-[var(--black)] dark:text-[var(--white)]'>
                        {totalPages.toLocaleString()}
                    </strong>
                </Typography>

                <div className='flex gap-x-2'>
                    <PaginationIconButton onClick={next} disabled={currentPage === totalPages - 1}>
                        <ArrowRightIcon strokeWidth={2} className='h-3 w-3 sm:h-4 sm:w-4' />
                    </PaginationIconButton>

                    <PaginationIconButton
                        onClick={() => onChangePage(totalPages - 1)}
                        disabled={currentPage === totalPages - 1}
                    >
                        <ChevronDoubleRightIcon strokeWidth={2} className='h-3 w-3 sm:h-4 sm:w-4' />
                    </PaginationIconButton>
                </div>
            </div>
            <div className='flex items-center xs:border-2 xs:border-[var(--black)] xs:dark:border-[var(--white)] xs:px-2 rounded-lg gap-x-2'>
                <Typography className='hidden xs:block font-normal text-[14px] md:text-[16px] text-[var(--black)] dark:text-[var(--white)] my-0.5'>
                    Show rows:
                </Typography>

                <div className='hidden xs:block h-8 w-0.5 bg-[var(--black)] dark:bg-[var(--white)]'></div>

                <select
                    className='h-6 text-[14px] md:text-[16px] rounded-md px-1 my-0.5'
                    onChange={e => onChangeNumRows(Number(e.target.value))}
                >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                </select>
            </div>
        </div>
    );
};

export default Pagination;
