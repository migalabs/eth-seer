import styled from '@emotion/styled';

export const TooltipContainer = styled.div`
    position: relative;

    &:hover div {
        display: flex;
    }
`;

const TooltipContentContainer = styled.div`
    position: absolute;
    left: calc(50% - 110px);
    height: 115px;
    width: 220px;
    display: none;
    flex-direction: column;
    padding-top: 35px;
    z-index: 1;
    align-items: center;

    background-repeat: no-repeat;
    background-size: 100% auto;
    transition: all 0.1s ease-in-out;

    span {
        font-family: var(--headingFont);
        font-style: normal;
        font-weight: 700;
        font-size: 7px;
        text-transform: uppercase;
        white-space: nowrap;
    }

    @media (min-width: 768px) {
        left: calc(50% - 117.5px);
        width: 235px;
        padding-top: 40px;

        span {
            font-size: 7.5px;
        }
    }
`;

type Props = {
    tooltipColor: string;
    colorLetter: string;
    mobile?: boolean;
};

export const TooltipContentContainerStats = styled(TooltipContentContainer)<Props>`
    top: 20px;
    background-image: ${({ tooltipColor, mobile }) =>
        tooltipColor === 'pink' && !mobile
            ? `url('/static/images/tooltips/tooltip_${tooltipColor}_2.svg')`
            : `url('/static/images/tooltips/tooltip_${tooltipColor}.svg')`};
    width: 220px;
    span {
        color: ${({ colorLetter }) => colorLetter};
        padding: 6.25px;
    }
    @media (min-width: 1300px) {
        background-image: ${({ tooltipColor }) => `url('/static/images/tooltips/tooltip_${tooltipColor}.svg')`};
    }

    @media (max-width: 1300px) {
        left: ${({ tooltipColor, mobile }) => tooltipColor === 'pink' && !mobile && 'calc(50% - 218.5px)'};
    }
`;

export const TooltipContentContainerBlocks = styled(TooltipContentContainer)`
    top: 50px;
    background-image: url('/static/images/tooltips/tooltip_white.svg');
    width: 200px;
    left: calc(50% - 100px);
    padding-top: 30px;

    span {
        color: black;
        padding: 3px;
    }
`;
type PropsHeader = {
    rewards?: boolean;
    time?: boolean;
};
export const TooltipContentContainerHeaders = styled(TooltipContentContainerBlocks)<PropsHeader>`
    top: 22px;
    width: 220px;
    left: calc(50% - 110px);
    padding-top: 35px;
    background-image: ${({ rewards, time }) =>
        rewards
            ? `url('/static/images/tooltips/tooltip_white_2.svg')`
            : time
            ? `url('/static/images/tooltips/tooltip_white_3.svg')`
            : `url('/static/images/tooltips/tooltip_white.svg')`};

    @media (min-width: 768px) {
        padding-top: 30px;

        span {
            padding: 0.5px;
            font-size: 7.5px;
        }
    }

    @media (min-width: 1300px) {
        background-image: url('/static/images/tooltips/tooltip_white.svg');
    }

    @media (max-width: 1300px) {
        left: ${({ rewards }) => rewards && 'calc(50% - 227.5px)'};
        left: ${({ time }) => time && 'calc(50% - 13.5px)'};
    }
`;
