import { useState, useEffect } from 'react';

const useLargeView = () => {
    const [largeView, setLargeView] = useState(true);

    useEffect(() => {
        const handleResize = () => {
            setLargeView(window.innerWidth > 768);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return largeView;
};

export default useLargeView;
