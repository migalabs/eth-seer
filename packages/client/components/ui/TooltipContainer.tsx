import styled from '@emotion/styled';

const TooltipContainer = styled.div`
    position: relative;

    &:hover > div:last-of-type {
        visibility: visible;
        opacity: 1;
    }
`;

export default TooltipContainer;
