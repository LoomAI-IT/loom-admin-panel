import {Link, useLocation} from 'react-router-dom';
import {Building2, LayoutDashboard} from 'lucide-react';
import './Sidebar.css';

interface MenuItem {
    path: string;
    label: string;
    icon: React.ReactNode;
}

const menuItems: MenuItem[] = [
    {path: '/', label: 'Главная', icon: <LayoutDashboard />},
    {path: '/organizations', label: 'Организации', icon: <Building2 />},
];

export const Sidebar = () => {
    const location = useLocation();

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <h2 className="sidebar-title">
                    <Building2 />
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
                        {menuItems.map((item) => (
                            <li key={item.path} className="sidebar-menu-item">
                                <Link
                                    to={item.path}
                                    className={`sidebar-menu-link ${location.pathname === item.path ? 'sidebar-menu-link--active' : ''}`}
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
    );
};
