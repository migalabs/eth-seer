import styled from '@emotion/styled';

export const TooltipContainer = styled.div`
    position: relative;
    /* width: fit-content; */
    margin: 0 auto;

    &:hover div {
        display: flex;
    }
`;

const TooltipContentContainer = styled.div`
    position: absolute;
    display: none;
    flex-direction: column;
    z-index: 1;

    background-repeat: no-repeat;
    background-size: 100% auto;
    transition: all 0.1s ease-in-out;

    span {
        font-family: var(--headingFont);
        font-style: normal;
        font-weight: 700;
        font-size: 10px;
        text-transform: uppercase;
        white-space: nowrap;
    }

    .title {
        font-size: 14px;
        text-align: center;
        margin-bottom: 8px;
    }
`;

type Props = {
    tooltipColor: string;
    colorLetter: string;
    mobile?: boolean;
    blocks?: boolean;
};

export const TooltipContentContainerStats = styled(TooltipContentContainer)<Props>`
    position: absolute;
    top: ${({ mobile, blocks }) => (mobile ? '80px' : blocks ? '45px' : '20px')};
    left: ${({ blocks }) => (blocks ? 'calc(25% - 100px)' : 'calc(50% - 110px)')};
    height: 110px;
    width: 220px;
    padding: 35px 5px 0px 5px;
    background-image: ${({ tooltipColor }) => `url('/static/images/tooltip_${tooltipColor}.svg')`};
    align-items: center;

    span {
        color: ${({ colorLetter }) => colorLetter};
        font-size: 8px;
        padding: ${({ blocks }) => (blocks ? '3px' : '6.25px')};
    }
`;
