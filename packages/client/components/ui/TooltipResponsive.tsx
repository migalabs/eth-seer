import React, { useContext } from 'react';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

type Props = {
    width: number;
    content: any;
    top?: string;
    polygonLeft?: boolean;
    polygonRight?: boolean;
    tooltipAbove?: boolean;
};

const TooltipResponsive = ({ width, content, top, polygonLeft, polygonRight, tooltipAbove }: Props) => {
    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) ?? {};

    const getParentLeftPosition = () => {
        if (polygonLeft) {
            return '-25px';
        } else if (polygonRight) {
            return `-${width - 50}px`;
        } else {
            return `calc(50% - ${width / 2}px)`;
        }
    };

    const getParentTopPosition = () => {
        if (tooltipAbove) {
            return '-100px';
        } else {
            return '30px';
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
            className='absolute flex-col text-center rounded-md py-4 px-4 mt-2 mx-auto font-medium hidden z-[var(--zIndexTooltip)] text-[12px] leading-5 normal-case'
            style={{
                width,
                left: getParentLeftPosition(),
                backgroundColor: themeMode?.darkMode ? 'var(--darkGray)' : 'var(--white)',
                color: themeMode?.darkMode ? 'var(--white)' : 'var(--black)',
                top: getParentTopPosition(),
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
                <polygon
                    style={{ fill: themeMode?.darkMode ? 'var(--darkGray)' : 'var(--white)' }}
                    points={getPoints()}
                />
            </svg>
        </div>
    );
};

export default TooltipResponsive;
