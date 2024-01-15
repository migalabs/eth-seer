import React from 'react';
import Image from 'next/image';

type Props = {
    src: string;
    alt: string;
    width: number;
    height: number;
    className?: string;
    priority?: boolean;
    title?: string;
    onClick?: () => void;
};

const CustomImage = ({ src, alt, width, height, className, priority, title, onClick }: Props) => {
    return (
        <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className={className}
            priority={priority}
            title={title}
            onClick={onClick}
        />
    );
};

export default CustomImage;
