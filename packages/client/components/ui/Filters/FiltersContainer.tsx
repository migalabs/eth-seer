import React, { useState } from 'react';

// Components
import FiltersButton from './FiltersButton';
import FiltersMenu from './FiltersMenu';

// Props
type Props = {
    children: React.ReactNode;
    onApply?: () => void;
    onClearAll?: () => void;
};

const FiltersContainer = ({ children, onApply, onClearAll }: Props) => {
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

            <FiltersMenu isVisible={showMenu} onApply={onApply} onClearAll={onClearAll} onClose={handleClose}>
                {children}
            </FiltersMenu>
        </div>
    );
};

export default FiltersContainer;
