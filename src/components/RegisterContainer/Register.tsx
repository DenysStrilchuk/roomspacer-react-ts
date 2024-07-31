import React, {useEffect, useState} from 'react';
import { useSelector } from 'react-redux';
import {authActions, RootState} from "../../store";
import {useAppDispatch} from "../../hooks";
import {useNavigate} from "react-router-dom";

const Register = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isRegistered,loading, error } = useSelector((state: RootState) => state.auth);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(authActions.register({ email, password, name }));
    };

    useEffect(() => {
        if (isRegistered) {
            navigate('/auth/login');
        }
    }, [isRegistered, navigate]);

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
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
                <button type="submit" disabled={loading}>Register</button>
            </form>
            {error && <p>{error}</p>}
        </div>
    );
};

export { Register };
