import React from 'react';

// Props
type Props = {
    content: string;
    bg: string;
    color: string;
    boxShadow: string;
    width: number;
};

const CardContent = ({ content, bg, color, boxShadow, width }: Props) => {
    return (
        <span
            className='block px-5 rounded-md font-medium capitalize py-2 text-center'
            style={{ background: bg, color, boxShadow, width }}
        >
            {content}
        </span>
    );
};

export default CardContent;
