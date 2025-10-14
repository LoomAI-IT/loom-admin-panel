import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
import {LoginPage} from '../../pages/login';
import {EntitiesPage} from '../../pages/entities';
import {OrganizationsMenuPage} from '../../pages/organizations-menu';
import {OrganizationDetailPage} from '../../pages/organization-detail';
import {MainLayout} from '../layouts/MainLayout';
import {PrivateRoute} from './PrivateRoute';

export const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage/>}/>
                <Route
                    path="/"
                    element={
                        <PrivateRoute>
                            <MainLayout/>
                        </PrivateRoute>
                    }
                >
                    <Route index element={<EntitiesPage/>}/>
                    <Route path="organizations" element={<OrganizationsMenuPage/>}/>
                    <Route path="organizations/:id" element={<OrganizationDetailPage/>}/>
                    {/* Здесь будут добавляться роуты для других сущностей */}
                </Route>
                <Route path="*" element={<Navigate to="/" replace/>}/>
            </Routes>
        </BrowserRouter>
    );
};
