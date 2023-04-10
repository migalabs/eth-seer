import styled from '@emotion/styled';

const assetPrefix = process.env.NEXT_PUBLIC_ASSET_PREFIX || '';

export const TooltipContainer = styled.div`
    position: relative;

    &:hover div {
        display: flex;
    }
`;

const TooltipContentContainer = styled.div`
    position: absolute;
    left: calc(50% - 115px);
    height: 117.5px;
    width: 230px;
    display: none;
    flex-direction: column;
    padding-top: 40px;
    z-index: 1;
    align-items: center;

    background-repeat: no-repeat;
    background-size: 100% auto;
    transition: all 0.1s ease-in-out;

    span {
        font-family: var(--headingFont);
        font-style: normal;
        font-size: 7px;
        text-transform: uppercase;
        white-space: nowrap;
        color: black;
        padding: 3px;
    }

    @media (min-width: 768px) {
        left: calc(50% - 125px);
        height: 120px;
        width: 250px;
        padding-top: 45px;

        span {
            font-size: 7.5px;
        }
    }
`;

type Props = {
    tooltipColor: string;
    colorLetter: string;
};

export const TooltipContentContainerStats = styled(TooltipContentContainer)<Props>`
    top: 20px;
    left: calc(50% - 115px);
    width: 230px;
    background-image: ${({ tooltipColor }) =>
        `url('${assetPrefix}/static/images/tooltips/tooltip_${tooltipColor}.svg')`};

    span {
        color: ${({ colorLetter }) => colorLetter};
        padding: 6.25px;
    }

    @media (min-width: 768px) {
        left: ${({ tooltipColor }) => (tooltipColor === 'pink' ? 'calc(50% - 230px)' : 'calc(50% - 117.5px)')};
        width: 235px;
        background-image: ${({ tooltipColor }) =>
            tooltipColor === 'pink'
                ? `url('${assetPrefix}/static/images/tooltips/tooltip_${tooltipColor}_left.svg')`
                : `url('${assetPrefix}/static/images/tooltips/tooltip_${tooltipColor}.svg')`};
    }

    @media (min-width: 1280px) {
        left: calc(50% - 117.5px);
        background-image: ${({ tooltipColor }) =>
            `url('${assetPrefix}/static/images/tooltips/tooltip_${tooltipColor}.svg')`};
    }
`;

export const TooltipContentContainerBlocks = styled(TooltipContentContainer)`
    left: calc(50% - 110px);
    height: 115px;
    width: 220px;
    top: 40px;
    background-image: url('${assetPrefix}/static/images/tooltips/tooltip_white.svg')};
    width: 200px;
    left: calc(50% - 100px);
    padding-top: 30px;

    @media (min-width: 768px) {
        top: 45px;
    }

    @media (min-width: 1150px) {
        top: 50px;
    }
`;

type PropsHeader = {
    rightSide?: boolean;
    leftSide?: boolean;
    epoch?: boolean;
};

export const TooltipContentContainerHeaders = styled(TooltipContentContainer)<PropsHeader>`
    top: 22px;
    width: 220px;
    left: calc(50% - 110px);
    padding-top: 38px;
    background-image: ${({ rightSide, leftSide }) =>
        rightSide
            ? `url(${assetPrefix}/static/images/tooltips/tooltip_white_left.svg)`
            : leftSide
            ? `url(${assetPrefix}/static/images/tooltips/tooltip_white_right.svg)`
            : `url(${assetPrefix}/static/images/tooltips/tooltip_white.svg)`};

    @media (min-width: 768px) {
        padding-top: 32px;

        span {
            padding: ${({ epoch }) => (epoch ? '20px' : '0.5px')};
            font-size: 7.5px;
        }
    }

    @media (min-width: 768px) {
        left: ${({ rightSide, leftSide }) =>
            rightSide ? 'calc(50% - 240px)' : leftSide ? 'calc(50% - 13.5px)' : 'calc(50% - 124px)'};
    }

    @media (min-width: 1280px) {
        left: calc(50% - 125px);
        background-image: url('${assetPrefix}/static/images/tooltips/tooltip_white.svg');
    }
`;
