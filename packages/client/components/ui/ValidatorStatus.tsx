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

    useEffect(() => {
        if (status === 'active') {
            setText(status);
            setColor('#00720B');
            setBackgroundColor('#83E18C');
        } else if (status === 'slashed') {
            setText(status);
            setColor('#980E0E');
            setBackgroundColor('#FF9090');
        } else if (status === 'exit') {
            setText('exited');
            setColor('#0016D8');
            setBackgroundColor('#BDC4FF');
        } else if (status === 'in queue to activation') {
            setText('deposited');
            setColor('#E86506');
            setBackgroundColor('#FFC163');
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status]);

    return (
        <span
            className='block uppercase border-2 rounded-3xl font-bold leading-3 pt-2 pb-1 md:pt-[7px] px-3 md:px-5'
            style={{ backgroundColor, borderColor: color, color }}
        >
            {text}
        </span>
    );
};

export default ValidatorStatus;
