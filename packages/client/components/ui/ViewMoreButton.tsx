import React from 'react';

// Props
type Props = {
    onClick: () => void;
};

const ViewMoreButton = ({ onClick }: Props) => {
    return (
        <button
            className='md:hover:bg-white transition text-black flex cursor-pointer mx-auto w-fit text-[14px] bg-[#c9b6f8] font-medium rounded-md px-6 py-4'
            onClick={onClick}
        >
            View more
        </button>
    );
};

export default ViewMoreButton;
