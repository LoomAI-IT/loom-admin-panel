import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../../pages/login';
import { EntitiesPage } from '../../pages/entities';
import { MainLayout } from '../layouts/MainLayout';
import { PrivateRoute } from './PrivateRoute';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<EntitiesPage />} />
          {/* Здесь будут добавляться роуты для сущностей */}
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
