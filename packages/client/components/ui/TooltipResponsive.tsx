import React from 'react';

type Props = {
    width: number;
    content: any;
    top?: string;
    polygonLeft?: boolean;
    polygonRight?: boolean;
    tooltipAbove?: boolean;
};

const TooltipResponsive = ({ width, content, top, polygonLeft, polygonRight, tooltipAbove }: Props) => {
    const getParentLeftPosition = () => {
        if (polygonLeft) {
            return 'calc(50% - 35px)';
        } else if (polygonRight) {
            return `calc(50% - ${width - 35}px)`;
        } else {
            return `calc(50% - ${width / 2}px)`;
        }
    };

    const getParentTopPosition = () => {
        if (tooltipAbove) {
            return '-100px';
        } else {
            return top ?? '30px';
        }
    };

    const getPolygonLeftPosition = () => {
        if (polygonLeft) {
            return '15px';
        } else if (polygonRight) {
            return 'calc(100% - 55px)';
        } else {
            return 'calc(50% - 20px)';
        }
    };

    const getPolygonTopPosition = () => {
        if (tooltipAbove) {
            return 'calc(100% - 1px)';
        } else {
            return '0';
        }
    };

    const getPoints = () => {
        if (tooltipAbove) {
            return '20,0 127.5,107.5 235,0';
        } else {
            return '20,0 127.5,-107.5 235,0';
        }
    };

    return (
        <div
            className='absolute flex flex-col text-center rounded-md py-4 px-4 mt-2 mx-auto font-medium z-[var(--zIndexTooltip)] text-[12px] leading-5 normal-case text-[var(--black)] dark:text-[var(--white)] bg-[var(--white)] dark:bg-[var(--darkGray)] invisible opacity-0'
            style={{
                width,
                left: getParentLeftPosition(),
                top: getParentTopPosition(),
                transition: 'visibility 0.5s, opacity 0.5s ease-in-out',
            }}
        >
            {content}
            <svg
                className='absolute h-5 overflow-visible w-10'
                x='0px'
                y='0px'
                viewBox='0 0 255 255'
                xmlSpace='preserve'
                style={{ left: getPolygonLeftPosition(), top: getPolygonTopPosition() }}
            >
                <polygon className='fill-[var(--white)] dark:fill-[var(--darkGray)]' points={getPoints()} />
            </svg>
        </div>
    );
};

export default TooltipResponsive;
