import styled from '@emotion/styled';
import { url } from 'inspector';

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
        line-height: 12px;
        letter-spacing: 1px;
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
};
export const TooltipContentContainerStats = styled(TooltipContentContainer)<Props>`
    position: absolute;
    top: ${({ mobile }) => (mobile ? '80px' : '20px')};
    left: calc(50% - 100px);
    height: 100px;
    width: 200px;
    padding: 30px 1.4px 0px 2.4px;
    background-image: ${({ tooltipColor }) => `url('/static/images/tooltip_${tooltipColor}.svg')`};
    align-items: center;

    span {
        color: ${({ colorLetter }) => `${colorLetter}`};
        font-size: 7px;
        padding: 6.25px;
    }
`;
