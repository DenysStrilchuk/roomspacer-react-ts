import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState, authActions } from '../../store';
import { useAppDispatch } from '../../hooks';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const dispatch = useAppDispatch();
    const isLogin = useSelector((state: RootState) => state.auth.isLogin);

    useEffect(() => {
        if (!isLogin) {
            (async () => {
                await dispatch(authActions.checkToken());
            })();
        }
    }, [dispatch, isLogin]);

    return isLogin ? <>{children}</> : <Navigate to="/auth/login" replace />;
};

export { PrivateRoute };
