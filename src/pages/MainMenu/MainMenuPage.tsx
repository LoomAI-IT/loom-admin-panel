import {Link} from 'react-router-dom';
import {Building2, Users, FolderKanban, TrendingUp} from 'lucide-react';
import './MainMenuPage.css';

export const MainMenuPage = () => {
    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1 className="dashboard-title">Добро пожаловать!</h1>
                <p className="dashboard-subtitle">Обзор системы управления</p>
            </div>

            <div className="dashboard-stats">
                <div className="stat-card stat-card--primary">
                    <div className="stat-card-header">
                        <h3 className="stat-card-title">Организации</h3>
                        <div className="stat-card-icon">
                            <Building2 />
                        </div>
                    </div>
                    <p className="stat-card-value">-</p>
                    <div className="stat-card-footer">
                        Всего зарегистрировано
                    </div>
                </div>

                <div className="stat-card stat-card--success">
                    <div className="stat-card-header">
                        <h3 className="stat-card-title">Сотрудники</h3>
                        <div className="stat-card-icon">
                            <Users />
                        </div>
                    </div>
                    <p className="stat-card-value">-</p>
                    <div className="stat-card-footer">
                        Активных пользователей
                    </div>
                </div>

                <div className="stat-card stat-card--warning">
                    <div className="stat-card-header">
                        <h3 className="stat-card-title">Категории</h3>
                        <div className="stat-card-icon">
                            <FolderKanban />
                        </div>
                    </div>
                    <p className="stat-card-value">-</p>
                    <div className="stat-card-footer">
                        Доступных категорий
                    </div>
                </div>

                <div className="stat-card stat-card--danger">
                    <div className="stat-card-header">
                        <h3 className="stat-card-title">Активность</h3>
                        <div className="stat-card-icon">
                            <TrendingUp />
                        </div>
                    </div>
                    <p className="stat-card-value">100%</p>
                    <div className="stat-card-footer">
                        Системная активность
                    </div>
                </div>
            </div>

            <div className="dashboard-quick-actions">
                <h2 className="dashboard-section-title">Быстрые действия</h2>
                <div className="quick-actions-grid">
                    <Link to="/organizations" className="quick-action-card">
                        <div className="quick-action-icon">
                            <Building2 size={20} />
                        </div>
                        <span className="quick-action-text">Управление организациями</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};
