import React, { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../../store';

interface PrivateRouteProps {
    children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const isLogin = useSelector((state: RootState) => state.auth.isLogin);

    return isLogin ? <>{children}</> : <Navigate to="/auth/login" replace />;
};

export { PrivateRoute };
