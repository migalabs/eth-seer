// Components
import TooltipContainer from './TooltipContainer';
import TooltipResponsive from './TooltipResponsive';

type Props = {
    title?: string;
    percent?: number;
    text?: string;
    color: string;
    backgroundColor: string;
    tooltipColor?: string;
    tooltipContent?: any;
    width?: number;
    widthTooltip?: number;
    tooltipAbove?: boolean;
};

const ProgressSmoothBar = ({
    title,
    percent,
    text,
    color,
    backgroundColor,
    tooltipColor,
    tooltipContent,
    width,
    widthTooltip,
    tooltipAbove,
}: Props) => {
    const shouldDisplayPercent = percent !== undefined;

    const widthInnerDiv = shouldDisplayPercent
        ? percent > 0
            ? Math.min(Number(percent * 100), 100).toFixed(0)
            : 100
        : 100;

    return (
        <div className='text-center'>
            {title && <p className='py-1'>{title}</p>}

            <div className='rounded-md p-1 text-[12px]' style={{ backgroundColor: color, width: width ?? 'auto' }}>
                <div className='rounded-sm' style={{ backgroundColor, width: `${widthInnerDiv}%` }}>
                    {tooltipColor && tooltipContent ? (
                        <TooltipContainer>
                            <p className='font-medium' style={{ color, cursor: 'default' }}>
                                {shouldDisplayPercent
                                    ? `${Number(Number(percent * 100).toFixed(2)).toLocaleString()}%`
                                    : text}
                            </p>

                            <TooltipResponsive
                                width={widthTooltip ?? 100}
                                content={tooltipContent}
                                tooltipAbove={tooltipAbove}
                            />
                        </TooltipContainer>
                    ) : (
                        <p className='font-medium' style={{ color, cursor: 'default' }}>
                            {shouldDisplayPercent
                                ? `${Number(Number(percent * 100).toFixed(2)).toLocaleString()}%`
                                : text}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProgressSmoothBar;
