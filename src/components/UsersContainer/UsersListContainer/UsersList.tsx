import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import css from './UsersList.module.css';
import {useAppDispatch} from "../../../hooks";
import {RootState} from "../../../store";
import {userActions} from "../../../store/slices/userSlice";

const UsersList: React.FC = () => {
    const dispatch = useAppDispatch();
    const { users, error } = useSelector((state: RootState) => state.user);

    useEffect(() => {
        dispatch(userActions.fetchAllUsers({ email: '', name: '' }));
    }, [dispatch]);

    if (error) {
        return <p>Error: {error.message}</p>;
    }

    return (
        <div className={css.usersContainer}>
            <h2>People</h2>
            <ul>
                {users.map((user) => (
                    <li key={user.uid}>{user.name} ({user.email})</li>
                ))}
            </ul>
        </div>
    );
};

export { UsersList };
