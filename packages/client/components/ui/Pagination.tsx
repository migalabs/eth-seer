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
    onChangeNumRows: (numRows: number) => void;
};

const Pagination = ({ currentPage, totalPages, onChangePage, onChangeNumRows }: Props) => {
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
        <div className='flex flex-col md:flex-row items-center w-11/12 xl:w-10/12 mx-auto justify-center lg:justify-start mt-4 gap-x-8'>
            <div className='flex items-center border-2 border-[var(--black)] dark:border-[var(--white)] px-2 rounded-lg gap-x-2'>
                <Typography className='font-normal text-[14px] md:text-[16px] text-[var(--black)] dark:text-[var(--white)] my-0.5'>
                    Show rows:
                </Typography>

                <div className='h-8 w-0.5 bg-[var(--black)] dark:bg-[var(--white)]'></div>

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
            <div className='flex items-center gap-x-4'>
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
                    <strong className='text-[var(--black)] dark:text-[var(--white)]'>
                        {totalPages.toLocaleString()}
                    </strong>
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
        </div>
    );
};

export default Pagination;
