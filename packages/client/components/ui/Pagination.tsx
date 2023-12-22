import React, { useContext } from 'react';
import { IconButton, Typography } from '@material-tailwind/react';
import { ArrowRightIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

// Props
interface Props {
    currentPage: number;
    totalPages: number;
    onChangePage: (newPage: number) => void;
}

const Pagination = ({ currentPage, totalPages, onChangePage }: Props) => {
    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) ?? {};

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
                style={{
                    borderColor: themeMode?.darkMode ? 'var(--white)' : 'var(--black)',
                    color: themeMode?.darkMode ? 'var(--white)' : 'var(--black)',
                }}
                className='flex items-center justify-center border-2'
            >
                <ArrowLeftIcon strokeWidth={2} className='h-4 w-4' />
            </IconButton>

            <Typography
                style={{ color: themeMode?.darkMode ? 'var(--white)' : 'var(--black)' }}
                className='font-normal text-[16px]'
            >
                Page{' '}
                <strong style={{ color: themeMode?.darkMode ? 'var(--white)' : 'var(--black)' }}>
                    {(currentPage + 1).toLocaleString()}
                </strong>{' '}
                of{' '}
                <strong style={{ color: themeMode?.darkMode ? 'var(--white)' : 'var(--black)' }}>
                    {totalPages.toLocaleString()}
                </strong>
            </Typography>

            <IconButton
                size='sm'
                variant='outlined'
                onClick={next}
                disabled={currentPage === totalPages - 1}
                style={{
                    borderColor: themeMode?.darkMode ? 'var(--white)' : 'var(--black)',
                    color: themeMode?.darkMode ? 'var(--white)' : 'var(--black)',
                }}
                className='flex items-center justify-center border-2'
            >
                <ArrowRightIcon strokeWidth={2} className='h-4 w-4' />
            </IconButton>
        </div>
    );
};

export default Pagination;
