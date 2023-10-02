
import React, { useContext } from 'react';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

type Props = {
    width: number;
    backgroundColor: string;
    colorLetter: string;
    content: any;
    top?: string;
    polygonLeft?: boolean;
    polygonRight?: boolean;
};

const TooltipResponsive = ({ width, backgroundColor, colorLetter, content, top, polygonLeft, polygonRight }: Props) => {
    const GetParentLeftPosition = () => {
        if (polygonLeft) {
            return '-25px';
        } else if (polygonRight) {
            return `-${width - 50}px`;
        } else {
            return `calc(50% - ${width / 2}px)`;
        }
    };

    const GetPolygonLeftPosition = () => {
        if (polygonLeft) {
            return '15px';
        } else if (polygonRight) {
            return 'calc(100% - 55px)';
        } else {
            return 'calc(50% - 20px)';
        }
    };

    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) ?? {};

    return (
        <div
            className='absolute flex-col rounded-md py-4 px-4 mt-2 mx-auto hidden z-[var(--zIndexTooltip)] text-[12px] leading-4 uppercase'
            style={{
                width,
                left: GetParentLeftPosition(),
                backgroundColor: themeMode?.darkMode ? 'var(--darkGray)' : 'var(--white)',
                color: themeMode?.darkMode ? 'var(--white)' : 'var(--black)',
                top: top ?? '30px',
            }}
        >
            {content}
            <svg
                className='absolute h-5 top-0 overflow-visible w-10'
                x='00px'
                y='0px'
                viewBox='0 0 255 255'
                xmlSpace='preserve'
                style={{ left: GetPolygonLeftPosition() }}
            >
                <polygon style={{ fill: themeMode?.darkMode ? 'var(--darkGray)' : 'var(--white)' }} points='20,0 127.5,-107.5 235,0' />
            </svg>
            
        </div>
    );
};

export default TooltipResponsive;
