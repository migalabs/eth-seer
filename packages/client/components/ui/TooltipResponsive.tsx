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

    return (
        <div
            className='absolute flex-col border-2 rounded-2xl py-4 px-4 mt-2 mx-auto hidden z-20 text-[7px] uppercase leading-4'
            style={{
                width,
                left: GetParentLeftPosition(),
                backgroundColor,
                color: colorLetter,
                borderColor: colorLetter,
                top: top ?? '30px',
            }}
        >
            {content}
            <svg
                className='absolute h-10 top-0 overflow-visible w-10'
                x='00px'
                y='0px'
                viewBox='0 0 255 255'
                xmlSpace='preserve'
                style={{ left: GetPolygonLeftPosition() }}
            >
                <polygon style={{ fill: colorLetter }} points='0,0 127.5,-127.5 255,0' />
                <polygon style={{ fill: backgroundColor }} points='20,0 127.5,-107.5 235,0' />
            </svg>
        </div>
    );
};

export default TooltipResponsive;
