import styled from '@emotion/styled';

const TooltipContainer = styled.div`
    position: relative;

    &:hover div {
        visibility: visible;
        opacity: 1;
    }
`;

export default TooltipContainer;
