import {Outlet} from 'react-router-dom';

import {Sidebar} from '../../widgets/Sidebar';

import './MainLayout.css';

export const MainLayout = () => {
    return (
        <div>
            <Sidebar/>
            <main>
                <Outlet/>
            </main>
        </div>
    );
};
