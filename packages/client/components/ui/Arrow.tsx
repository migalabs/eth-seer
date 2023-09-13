import React, { useContext } from 'react';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

// Props
type Props = {
    direction: 'right' | 'left';
    height?: number;
    width?: number;
    className?: string;
    onClick?: () => void;
};

const Arrow = ({ direction, height = 30, width = 30, className, onClick }: Props) => {
    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) ?? {};

    const getPath = () => {
        if (direction === 'left') {
            return 'M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z';
        } else {
            return 'M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z';
        }
    };

    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            width={width}
            height={height}
            viewBox='0 0 16 16'
            className={`stroke-1 dark-mode-class cursor-pointer ${className ?? ''}`}
            style={{
                stroke: themeMode?.darkMode ? 'var(--yellow1)' : 'var(--blue3)',
                fill: themeMode?.darkMode ? 'var(--yellow1)' : 'var(--blue3)',
            }}
            onClick={onClick}
        >
            <path fillRule='evenodd' d={getPath()} />
        </svg>
    );
};

export default Arrow;
