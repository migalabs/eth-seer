type Props = {
    width: number;
    backgroundColor: string;
    colorLetter: string;
    content: any;
};

const TooltipResponsive = ({ width, backgroundColor, colorLetter, content }: Props) => {
    return (
        <div
            className='absolute top-[30px] flex-col border-2 rounded-2xl py-4 px-8 mt-2 mx-auto hidden z-10 text-[7px] uppercase'
            style={{
                width,
                left: `calc(50% - ${width / 2}px)`,
                backgroundColor,
                color: colorLetter,
                borderColor: colorLetter,
            }}
        >
            {content}
            <svg
                className='absolute h-10 top-0 overflow-visible w-10 left-[calc(50%-20px)]'
                x='00px'
                y='0px'
                viewBox='0 0 255 255'
                xmlSpace='preserve'
            >
                <polygon style={{ fill: colorLetter }} points='0,0 127.5,-127.5 255,0' />
                <polygon style={{ fill: backgroundColor }} points='20,0 127.5,-107.5 235,0' />
            </svg>
        </div>
    );
};

export default TooltipResponsive;
