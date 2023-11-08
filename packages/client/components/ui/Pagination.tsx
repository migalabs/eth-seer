import React from 'react';
import { IconButton, Typography } from '@material-tailwind/react';
import { ArrowRightIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

export function Pagination() {
    const [active, setActive] = React.useState(1);

    const next = () => {
        if (active === 10) return;

        setActive(active + 1);
    };

    const prev = () => {
        if (active === 1) return;

        setActive(active - 1);
    };

    return (
        <div className='flex items-center w-11/12 lg:w-10/12 mx-auto justify-center lg:justify-start gap-10 mt-4 '>
            <IconButton
                size='sm'
                variant='outlined'
                onClick={prev}
                disabled={active === 1}
                className='flex items-center justify-center'
            >
                <ArrowLeftIcon strokeWidth={2} className='h-4 w-4' />
            </IconButton>
            <Typography color='gray' className='font-normal text-[16px]'>
                Page <strong className='text-gray-900'>{active}</strong> of{' '}
                <strong className='text-gray-900'>10</strong>
            </Typography>
            <IconButton
                size='sm'
                variant='outlined'
                onClick={next}
                disabled={active === 10}
                className='flex items-center justify-center'
            >
                <ArrowRightIcon strokeWidth={2} className='h-4 w-4' />
            </IconButton>
        </div>
    );
}

export default Pagination;
