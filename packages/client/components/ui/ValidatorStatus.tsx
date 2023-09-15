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
            setBackgroundColor('#D3FFD7');
        } else if (status === 'slashed') {
            setText(status);
            setColor('#980E0E');
            setBackgroundColor('#FFB7B7');
        } else if (status === 'exit') {
            setText('exited');
            setColor('#0016D8');
            setBackgroundColor('#BCC2FF');
        } else if (status === 'in queue to activation') {
            setText('deposited');
            setColor('#E86506');
            setBackgroundColor('#FFE5D2');
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
