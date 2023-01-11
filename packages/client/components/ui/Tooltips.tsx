import styled from '@emotion/styled';

export const TooltipContainer = styled.div`
    position: relative;

    &:hover div {
        display: flex;
    }
`;

const TooltipContentContainer = styled.div`
    position: absolute;
    left: calc(50% - 100px);
    height: 110px;
    width: 200px;
    display: none;
    flex-direction: column;
    padding-top: 30px;
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
        left: calc(50% - 115px);
        width: 230px;
        padding-top: 35px;

        span {
            font-size: 8px;
        }
    }
`;

type Props = {
    tooltipColor: string;
    colorLetter: string;
};

export const TooltipContentContainerStats = styled(TooltipContentContainer)<Props>`
    top: 20px;
    background-image: ${({ tooltipColor }) => `url('/static/images/tooltips/tooltip_${tooltipColor}.svg')`};

    span {
        color: ${({ colorLetter }) => colorLetter};
        padding: 6.25px;
    }
`;

export const TooltipContentContainerBlocks = styled(TooltipContentContainer)`
    top: 50px;
    background-image: url('/static/images/tooltips/tooltip_white.svg');

    span {
        color: black;
        padding: 3px;
    }
`;

export const TooltipContentContainerHeaders = styled(TooltipContentContainerBlocks)`
    top: 22px;
`;
