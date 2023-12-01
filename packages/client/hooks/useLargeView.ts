import { useState, useEffect } from 'react';

const useLargeView = () => {
    const isWindowAvailable = typeof window !== 'undefined';
    const [largeView, setLargeView] = useState(isWindowAvailable ? window.innerWidth > 768 : true);

    useEffect(() => {
        const handleResize = () => {
            setLargeView(window.innerWidth > 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return largeView;
};

export default useLargeView;
