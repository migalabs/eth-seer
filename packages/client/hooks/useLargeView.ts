import { useState, useEffect } from 'react';

const useLargeView = () => {
    const [isLargeView, setIsLargeView] = useState(true);

    useEffect(() => {
        const handleResize = () => {
            setIsLargeView(window.innerWidth > 768);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return isLargeView;
};

export default useLargeView;
