import React from 'react';

// Props
type Props = {
    content: string;
    bg: string;
    color: string;
    boxShadow: string;
};

const CardContent = ({ content, bg, color, boxShadow }: Props) => {
    return (
        <span
            className='block md:px-6 2xs:px-4 rounded-md font-medium capitalize py-2 text-center 2xs:text-[13px] md:text-[16px] md:w-[200px] md:h-[40px] 2xs:min-w-[135px] 2xs:max-w-[170px] md:min-w-[200px]'
            style={{ background: bg, color, boxShadow }}
        >
            {content}
        </span>
    );
};

export default CardContent;
