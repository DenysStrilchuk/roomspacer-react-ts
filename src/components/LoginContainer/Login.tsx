import React, {useEffect, useState} from 'react';
import { useSelector } from 'react-redux';
import {authActions, RootState} from "../../store";
import {useAppDispatch} from "../../hooks";
import {useNavigate} from "react-router-dom";

const Login = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isLogin, loading, error } = useSelector((state: RootState) => state.auth);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(authActions.login({ email, password }));
    };

    useEffect(() => {
        if (isLogin) {
            navigate('/main');
        }
    }, [isLogin, navigate]);

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading}>Login</button>
            </form>
            {error && <p>{error}</p>}
        </div>
    );
};

export { Login };
