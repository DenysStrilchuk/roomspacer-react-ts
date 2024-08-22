import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import css from './UsersList.module.css';
import { useAppDispatch } from "../../../hooks";
import { RootState } from "../../../store";
import { userActions } from "../../../store/slices/userSlice";
import defaultAvatar from '../../../assets/defaultAvatar.png';
import {UsersInfo} from "../UsersInfoContainer";

const UsersList: React.FC = () => {
    const dispatch = useAppDispatch();
    const { users, error } = useSelector((state: RootState) => state.user);
    const currentUser = useSelector((state: RootState) => state.auth.user);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        dispatch(userActions.fetchAllUsers({ email: '', name: '' }));
    }, [dispatch]);

    if (error) {
        return <p>Error: {error.message}</p>;
    }

    const filteredUsers = users.filter(user => user.uid !== currentUser?.uid);

    const handleUserClick = (user: any) => {
        setSelectedUser(user);
    };

    const handleClose = () => {
        setSelectedUser(null);
    };

    return (
        <div className={css.usersContainer}>
            <h3>People</h3>
            <ul className={css.userList}>
                {filteredUsers.map((user) => (
                    <li key={user.uid} onClick={() => handleUserClick(user)}>
                        <div className={css.userItem}>
                            <img
                                src={user.picture || defaultAvatar}
                                alt="User Avatar"
                                className={css.avatar}
                            />
                        </div>
                    </li>
                ))}
            </ul>
            <UsersInfo user={selectedUser} onClose={handleClose} />
        </div>
    );
};

export { UsersList };
