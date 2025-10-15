import './MobileMenuButton.css';

interface MobileMenuButtonProps {
    isOpen: boolean;
    onClick: () => void;
}

export const MobileMenuButton = ({ isOpen, onClick }: MobileMenuButtonProps) => {
    return (
        <button
            className={`mobile-menu-button ${isOpen ? 'mobile-menu-button--open' : ''}`}
            onClick={onClick}
            aria-label={isOpen ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={isOpen}
        >
            <span className="mobile-menu-button__line"></span>
            <span className="mobile-menu-button__line"></span>
            <span className="mobile-menu-button__line"></span>
        </button>
    );
};
