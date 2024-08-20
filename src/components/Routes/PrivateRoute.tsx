import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks';
import { authActions, RootState } from "../../store";
import CircularProgress from '@mui/material/CircularProgress';
import css from './PrivateRoute.module.css';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const dispatch = useAppDispatch();
    const isLogin = useSelector((state: RootState) => state.auth.isLogin);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            if (!isLogin) {
                await dispatch(authActions.checkToken());
            }
            setLoading(false);
        })();
    }, [dispatch, isLogin]);

    if (loading) {
        return (
            <div className={css.loaderContainer}>
                <CircularProgress sx={{ color: 'rgb(70, 77, 97)' }} />
            </div>
        );
    }

    return isLogin ? <>{children}</> : <Navigate to="/auth/login" replace />;
};

export { PrivateRoute };
