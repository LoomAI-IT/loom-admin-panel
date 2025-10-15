import {Navigate} from 'react-router-dom';
import * as React from "react";

import {useAuthStore} from '../../features/auth';

interface PrivateRouteProps {
    children: React.ReactNode;
}

export const PrivateRoute = ({children}: PrivateRouteProps) => {
    const {isAuthenticated} = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace/>;
    }

    return <>{children}</>;
};
