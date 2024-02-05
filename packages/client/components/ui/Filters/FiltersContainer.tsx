import React, { useState } from 'react';

// Components
import FiltersButton from './FiltersButton';
import FiltersMenu from './FiltersMenu';

// Props
type Props = {
    children: React.ReactNode;
};

const FiltersContainer = ({ children }: Props) => {
    // States
    const [showMenu, setShowMenu] = useState(false);

    const handleClick = () => {
        setShowMenu(!showMenu);
    };

    const handleClose = () => {
        setShowMenu(false);
    };

    return (
        <div className='relative'>
            <FiltersButton onClick={handleClick} />

            <FiltersMenu isVisible={showMenu} onClose={handleClose}>
                {children}
            </FiltersMenu>
        </div>
    );
};

export default FiltersContainer;
