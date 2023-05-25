import React, { useEffect, useRef } from 'react';

// Components
import CustomImage from './CustomImage';
import BlockImage from './BlockImage';
import Link from 'next/link';

type Props = {
    index: number;
    pool: string;
};

const EntityCard = ({ index, pool }: Props) => {
    const spanRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (spanRef.current) {
            const spanElement = spanRef.current;
            //   const parentElement = spanElement.parentElement as HTMLElement;
            const computedFontSize = parseFloat(getComputedStyle(spanElement).width) / pool.length;
            const fontSize = Math.min(12, computedFontSize);
            spanElement.style.fontSize = `${fontSize}px`;
        }
    }, [pool]);

    return (
        <Link href={`/entity/${pool.toLocaleLowerCase()}`}>
            <div className='relative w-44 h-56 mx-auto cursor-pointer'>
                <CustomImage
                    src='/static/images/entity-card.svg'
                    alt={pool}
                    width={170}
                    height={200}
                    className='absolute top-0 left-[calc(50%-85px)] max-h-56'
                />

                <span className='absolute text-sm top-3.5 left-[calc(50%-22px)]'>{String(index).padStart(3, '0')}</span>

                <div className='absolute top-[20%] left-[30%]'>
                    <BlockImage poolName={pool} width={60} height={60} />
                </div>

                <span ref={spanRef} className='absolute text-sm top-[118px] left-[16%] w-28 text-center'>
                    {pool}
                </span>
            </div>
        </Link>
    );
};

export default EntityCard;
