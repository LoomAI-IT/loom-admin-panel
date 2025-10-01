import { Outlet } from 'react-router-dom';
import { Sidebar } from '../../widgets/sidebar';
import './MainLayout.css';

export const MainLayout = () => {
  return (
    <div className="main-layout">
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};
