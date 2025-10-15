import {type JSX, useEffect} from "react";
import {Link, useLocation} from 'react-router-dom';
import {Building2, LayoutDashboard} from 'lucide-react';

import './Sidebar.css';

interface MenuItem {
    path: string;
    label: string;
    icon: JSX.Element;
}

const menuItems: MenuItem[] = [
    {path: '/', label: 'Главная', icon: <LayoutDashboard/>},
    {path: '/organizations', label: 'Организации', icon: <Building2/>},
];

interface SidebarProps {
    isMobileOpen?: boolean;
    onClose?: () => void;
}

export const Sidebar = ({ isMobileOpen = false, onClose }: SidebarProps) => {
    const location = useLocation();

    // Блокируем скролл body когда сайдбар открыт на мобилке
    useEffect(() => {
        if (isMobileOpen) {
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
        } else {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
        }

        return () => {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
        };
    }, [isMobileOpen]);

    const handleLinkClick = () => {
        // Закрываем меню при клике на ссылку на мобильных
        if (onClose) {
            onClose();
        }
    };

    return (
        <>
            {isMobileOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
            <aside className={`sidebar ${isMobileOpen ? 'sidebar--mobile-open' : ''}`}>
                <div className="sidebar-header">
                    <h2 className="sidebar-title">
                        <Building2/>
                        Админ панель
                    </h2>
                </div>
                <nav className="sidebar-nav">
                    {menuItems.length === 0 ? (
                        <div className="sidebar-empty">
                            Сущности не добавлены
                        </div>
                    ) : (
                        <ul className="sidebar-menu">
                            {menuItems.map((item, index) => (
                                <li
                                    key={item.path}
                                    className="sidebar-menu-item"
                                    style={{
                                        '--stagger-delay': `${index * 0.08}s`
                                    } as React.CSSProperties}
                                >
                                    <Link
                                        to={item.path}
                                        className={`sidebar-menu-link ${location.pathname === item.path ? 'sidebar-menu-link--active' : ''}`}
                                        onClick={handleLinkClick}
                                    >
                                        <span className="sidebar-menu-icon">{item.icon}</span>
                                        <span>{item.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </nav>
            </aside>
        </>
    );
};
