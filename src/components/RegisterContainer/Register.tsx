import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { authActions } from '../../store/slices/authSlice';
import { RootState } from '../../store/store';
import { useAppDispatch } from '../../hooks/useAppDispatch';

const Register = () => {
    const dispatch = useAppDispatch();
    const { loading, error } = useSelector((state: RootState) => state.auth);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Registering with:', { email, password, name }); // Лог даних форми
        dispatch(authActions.register({ email, password, name }));
    };

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
