import React from 'react';

// Components
import Arrow from './Arrow';
import LinkBlock from './LinkBlock';
import LinkEpoch from './LinkEpoch';
import LinkSlot from './LinkSlot';
import LinkValidator from './LinkValidator';
import Title from './Title';

// Props
type Props = {
    type: 'block' | 'epoch' | 'slot' | 'validator';
    value: number;
};

const TitleWithArrows = ({ type, value }: Props) => {
    const getArrow = (direction: 'left' | 'right') => {
        const nextValue = direction === 'left' ? value - 1 : value + 1;

        switch (type) {
            case 'block':
                return (
                    <LinkBlock block={nextValue}>
                        <Arrow direction={direction} />
                    </LinkBlock>
                );
            case 'epoch':
                return (
                    <LinkEpoch epoch={nextValue}>
                        <Arrow direction={direction} />
                    </LinkEpoch>
                );
            case 'slot':
                return (
                    <LinkSlot slot={nextValue}>
                        <Arrow direction={direction} />
                    </LinkSlot>
                );
            case 'validator':
                return (
                    <LinkValidator validator={nextValue}>
                        <Arrow direction={direction} />
                    </LinkValidator>
                );
        }
    };

    return (
        <div className='flex gap-x-3 justify-center items-center mt-14 xl:mt-0 mb-5'>
            {getArrow('left')}

            <Title className='capitalize' removeMarginTop>
                {type} {!Number.isNaN(value) && value.toLocaleString("en-US")}
            </Title>

            {getArrow('right')}
        </div>
    );
};

export default TitleWithArrows;
