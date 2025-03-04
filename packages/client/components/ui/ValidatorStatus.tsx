import React, { useState, useEffect } from 'react';

// Props
type Props = {
    status: string;
};

const ValidatorStatus = ({ status }: Props) => {
    // States
    const [text, setText] = useState('');
    const [color, setColor] = useState('');
    const [backgroundColor, setBackgroundColor] = useState('');
    const [boxShadow, setBoxShadow] = useState('');

    useEffect(() => {
        if (status === 'active') {
            setText(status);
            setColor('var(--white)');
            setBackgroundColor('var(--proposedGreen)');
            setBoxShadow('var(--boxShadowGreen)');
        } else if (status === 'slashed') {
            setText(status);
            setColor('var(--white)');
            setBackgroundColor('var(--missedRed)');
            setBoxShadow('var(--boxShadowRed)');
        } else if (status === 'exited') {
            setText('exited');
            setColor('var(--white)');
            setBackgroundColor('var(--exitedPurple)');
            setBoxShadow('var(--boxShadowPurple)');
        } else if (status === 'in_activation_queue') {
            setText('deposited');
            setColor('var(--white)');
            setBackgroundColor('var(--depositedBlue)');
            setBoxShadow('var(--boxShadowBlue)');
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status]);

    return (
        <span
            className='block capitalize rounded-md w-40 text-center md:w-[200px] md:h-[40px] font-medium py-2 md:pt-[7px] px-5 md:px-10 3xs:text-[13px] md:text-[16px]'
            style={{ backgroundColor, borderColor: color, color, boxShadow: boxShadow }}
        >
            {text}
        </span>
    );
};

export default ValidatorStatus;
