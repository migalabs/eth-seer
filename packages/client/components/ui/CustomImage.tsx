import React from 'react';
import Image from 'next/image';

type Props = {
    src: string;
    alt: string;
    width: number;
    height: number;
    className?: string;
    priority?: boolean;
    onClick?: () => void;
};

const CustomImage = ({ src, alt, width, height, className, priority, onClick }: Props) => {
    const assetPrefix = process.env.NEXT_PUBLIC_ASSET_PREFIX ?? '';

    return (
        <Image
            src={`${assetPrefix}${src}`}
            alt={alt}
            width={width}
            height={height}
            className={className}
            priority={priority}
            onClick={onClick}
        />
    );
};

export default CustomImage;
