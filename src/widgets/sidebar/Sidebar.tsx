import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

interface MenuItem {
  path: string;
  label: string;
}

// Здесь будут добавляться новые сущности
const menuItems: MenuItem[] = [
  { path: '/organizations', label: 'Организации' },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Админ панель</h2>
      </div>
      <nav className="sidebar-nav">
        {menuItems.length === 0 ? (
          <div className="sidebar-empty">
            Сущности не добавлены
          </div>
        ) : (
          <ul>
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={location.pathname === item.path ? 'active' : ''}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </aside>
  );
};
