import React, { useContext, ReactNode, Fragment, useRef } from 'react';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

// Components
import TooltipContainer from './TooltipContainer';
import CustomImage from './CustomImage';
import Loader from './Loader';

// Table Container
type TableContainerProps = {
    children: ReactNode;
    fullWidth?: boolean;
    showNoRowsText: boolean;
    noRowsText: string;
    fetchingRows?: boolean;
};

const TableContainer = ({ children, fullWidth, showNoRowsText, noRowsText, fetchingRows }: TableContainerProps) => {
    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) ?? {};

    return (
        <div className={`${fullWidth ? 'w-full' : 'mx-auto w-11/12 xl:w-10/12'} mt-4`}>
            {children}

            {showNoRowsText && !fetchingRows && (
                <div
                    className='flex mt-2 items-center justify-center rounded-md border-2 border-white px-4 py-4 bg-[var(--bgMainLightMode)] dark:bg-[var(--bgFairDarkMode)]'
                    style={{
                        boxShadow: themeMode?.darkMode ? 'var(--boxShadowCardDark)' : 'var(--boxShadowCardLight)',
                    }}
                >
                    <p className='uppercase text-[14px] md:text-[16px] font-medium text-[var(--black)] dark:text-[var(--white)]'>
                        {noRowsText}
                    </p>
                </div>
            )}

            {fetchingRows && (
                <div className='my-6'>
                    <Loader />
                </div>
            )}
        </div>
    );
};

// Large Table
type LargeTableProps = {
    children: ReactNode;
    minWidth: number;
    fullWidth?: boolean;
    noRowsText: string;
    fetchingRows?: boolean;
    showRowsWhileFetching?: boolean;
};

export const LargeTable = ({
    children,
    minWidth,
    fullWidth,
    noRowsText,
    fetchingRows,
    showRowsWhileFetching,
}: LargeTableProps) => {
    // Refs
    const containerRef = useRef<HTMLInputElement>(null);

    const handleMouseMove = (e: any) => {
        if (containerRef.current) {
            const x = e.pageX;
            const limit = 0.15;

            if (x < containerRef.current.clientWidth * limit) {
                containerRef.current.scrollLeft -= 10;
            } else if (x > containerRef.current.clientWidth * (1 - limit)) {
                containerRef.current.scrollLeft += 10;
            }
        }
    };

    const getHeaders = () =>
        React.Children.toArray(children).filter((child: any) => child.type.name === LargeTableHeader.name);

    const getRows = () =>
        React.Children.toArray(children)
            .filter((child: any) => child.type.name === LargeTableRow.name || child.type === Fragment)
            .flatMap((child: any) =>
                child.type.name === LargeTableRow.name
                    ? child
                    : React.Children.toArray(child.props.children).filter(
                          (child: any) => child.type.name === LargeTableRow.name
                      )
            );

    return (
        <TableContainer
            fullWidth={fullWidth}
            showNoRowsText={getRows().length === 0}
            noRowsText={noRowsText}
            fetchingRows={fetchingRows}
        >
            <div
                ref={containerRef}
                className='flex flex-col overflow-x-scroll overflow-y-hidden scrollbar-thin'
                onMouseMove={handleMouseMove}
            >
                <div
                    className='flex gap-x-1 justify-around px-2 xl:px-8 pb-3 capitalize text-[14px] md:text-[16px] text-[var(--darkGray)] dark:text-[var(--white)]'
                    style={{ minWidth }}
                >
                    {getHeaders()}
                </div>

                {(!fetchingRows || showRowsWhileFetching) && (
                    <div className='flex flex-col justify-center gap-y-4' style={{ minWidth }}>
                        {getRows()}
                    </div>
                )}
            </div>
        </TableContainer>
    );
};

// Large Table Header
type LargeTableHeaderProps = {
    text: string;
    width?: number | string;
    tooltipContent?: ReactNode;
};

export const LargeTableHeader = ({ text, width, tooltipContent }: LargeTableHeaderProps) => (
    <div className='flex items-center gap-x-1 justify-center' style={{ width: width ?? '100%' }}>
        <p className='mt-0.5 font-semibold'>{text}</p>

        {tooltipContent && (
            <TooltipContainer>
                <CustomImage
                    src='/static/images/icons/information_icon.webp'
                    alt='Attestation Accuracy information'
                    width={24}
                    height={24}
                />

                {tooltipContent}
            </TooltipContainer>
        )}
    </div>
);

// Large Table Row
type LargeTableRowProps = {
    children: ReactNode;
    secundary?: boolean;
};

export const LargeTableRow = ({ children, secundary }: LargeTableRowProps) => {
    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) ?? {};

    return (
        <div
            className={`flex gap-x-1 justify-around items-center text-[14px] rounded-md font-medium border-2 border-[#c9b6f8] px-2 xl:px-8 py-3 text-[var(--black)] dark:text-[var(--white)] text-center ${
                secundary
                    ? 'bg-[#5b5b5b50] dark:bg-[var(--bgDarkMode)]'
                    : 'bg-[var(--bgFairLightMode)] dark:bg-[var(--bgFairDarkMode)]'
            }`}
            style={{
                boxShadow: themeMode?.darkMode ? 'var(--boxShadowCardDark)' : 'var(--boxShadowCardLight)',
            }}
        >
            {children}
        </div>
    );
};

// Small Table
type SmallTableProps = {
    children: ReactNode;
    fullWidth?: boolean;
    noRowsText: string;
    fetchingRows?: boolean;
    showRowsWhileFetching?: boolean;
};

export const SmallTable = ({
    children,
    fullWidth,
    noRowsText,
    fetchingRows,
    showRowsWhileFetching,
}: SmallTableProps) => {
    const getCards = () =>
        React.Children.toArray(children)
            .filter((child: any) => child.type.name === SmallTableCard.name || child.type === Fragment)
            .flatMap((child: any) =>
                child.type.name === SmallTableCard.name
                    ? child
                    : React.Children.toArray(child.props.children).filter(
                          (child: any) => child.type.name === SmallTableCard.name
                      )
            );

    return (
        <TableContainer
            fullWidth={fullWidth}
            showNoRowsText={getCards().length === 0}
            noRowsText={noRowsText}
            fetchingRows={fetchingRows}
        >
            {(!fetchingRows || showRowsWhileFetching) && <div className='flex flex-col gap-y-4'>{getCards()}</div>}
        </TableContainer>
    );
};

// Small Table Card
type SmallTableCardProps = {
    children: ReactNode;
    secundary?: boolean;
};

export const SmallTableCard = ({ children, secundary }: SmallTableCardProps) => {
    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) ?? {};

    return (
        <div
            className={`flex flex-col gap-y-4 justify-around items-center text-[14px] rounded-md border-2 border-[#c9b6f8] px-3 py-4 text-[var(--black)] dark:text-[var(--white)] ${
                secundary
                    ? 'bg-[#5b5b5b50] dark:bg-[var(--bgDarkMode)]'
                    : 'bg-[var(--bgFairLightMode)] dark:bg-[var(--bgFairDarkMode)]'
            }`}
            style={{
                boxShadow: themeMode?.darkMode ? 'var(--boxShadowCardDark)' : 'var(--boxShadowCardLight)',
            }}
        >
            {children}
        </div>
    );
};
