import {Outlet} from 'react-router-dom';

import {Sidebar} from '../../widgets/Sidebar';

import './MainLayout.css';

export const MainLayout = () => {
    return (
        <div className="main-layout">
            <Sidebar/>
            <main className="main-layout-content">
                <div className="main-layout-container">
                    <Outlet/>
                </div>
            </main>
        </div>
    );
};
