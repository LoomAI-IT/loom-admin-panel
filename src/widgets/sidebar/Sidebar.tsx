import {Link, useLocation} from 'react-router-dom';
import './Sidebar.css';

interface MenuItem {
    path: string;
    label: string;
}

const menuItems: MenuItem[] = [
    {path: '/organizations', label: 'Организации'},
];

export const Sidebar = () => {
    const location = useLocation();

    return (
        <aside>
            <div>
                <h2>Админ панель</h2>
            </div>
            <nav>
                {menuItems.length === 0 ? (
                    <div>
                        Сущности не добавлены
                    </div>
                ) : (
                    <ul>
                        {menuItems.map((item) => (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
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
