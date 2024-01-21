import { useCallback, useEffect, useState } from 'react';

const useShuffleText = (generateTextFunction: () => string, interval: number = 1000) => {
    const [text, setText] = useState('');

    const shuffle = useCallback(() => {
        const newText = generateTextFunction();
        setText(newText);
    }, [generateTextFunction]);

    useEffect(() => {
        const intervalID = setInterval(shuffle, interval);
        return () => clearInterval(intervalID);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shuffle, interval]);

    return text;
};

export default useShuffleText;
