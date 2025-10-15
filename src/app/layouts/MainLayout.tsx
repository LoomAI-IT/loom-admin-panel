import {useState} from 'react';
import {Outlet} from 'react-router-dom';

import {Sidebar} from '../../widgets/Sidebar';
import {MobileMenuButton} from '../../shared/ui';

import './MainLayout.css';

export const MainLayout = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleToggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleCloseMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <div className="main-layout">
            <MobileMenuButton
                isOpen={isMobileMenuOpen}
                onClick={handleToggleMobileMenu}
            />
            <Sidebar
                isMobileOpen={isMobileMenuOpen}
                onClose={handleCloseMobileMenu}
            />
            <main className="main-layout-content">
                <div className="main-layout-container">
                    <Outlet/>
                </div>
            </main>
        </div>
    );
};
