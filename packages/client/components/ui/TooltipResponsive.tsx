
type Props = {
    width: number;
}

const TooltipResponsive = ({width}: Props) => {
    return (
        <div className='relative bg-white text-black text-xs border-2 border-black rounded-2xl py-2 px-3 mt-2 mx-auto'
            style={{width}}
        >
            <p>This is the tooltip text.</p>
            <svg
                className='absolute h-10 w-full left-0 bottom-full overflow-visible -m-10'
                x='0px'
                y='0px'
                viewBox='0 0 255 255'
                xmlSpace='preserve'
            >
                <polygon className='fill-black transform rotate-180' points='0,0 127.5,127.5 255,0' />
                <polygon className='fill-white transform rotate-180' points='20,0 127.5,107.5 235,0' />
            </svg>
        </div>
    );
};

export default TooltipResponsive;
