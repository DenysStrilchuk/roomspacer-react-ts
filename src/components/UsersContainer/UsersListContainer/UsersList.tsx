import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import css from './UsersList.module.css';
import {useAppDispatch} from "../../../hooks";
import {RootState} from "../../../store";
import {userActions} from "../../../store/slices/userSlice";
import defaultAvatar from '../../../assets/defaultAvatar.png';
import {IUser} from "../../../interfaces";
import {userService} from "../../../services";
import {UsersInviteWindow} from "../UsersInviteWindowContainer";


const UsersList: React.FC = () => {
    const dispatch = useAppDispatch();
    const {users, error} = useSelector((state: RootState) => state.user);
    const currentUser = useSelector((state: RootState) => state.auth.user);
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
    const [usersStatus, setUsersStatus] = useState<Array<{
        uid: string;
        email: string;
        online: boolean;
        lastOnline: Date | null
    }>>([]);

    useEffect(() => {
        dispatch(userActions.fetchAllUsers({email: '', name: ''}));

        const fetchUsersStatus = () => {
            userService.getUsersStatus()
                .then(status => setUsersStatus(status))
                .catch(error => console.error('Error fetching users status:', error));
        };

        fetchUsersStatus();
    }, [dispatch]);

    if (error) {
        return <p>Error: {error.message}</p>;
    }

    const filteredUsers = users.filter(user => user.uid !== currentUser?.uid);

    const handleUserClick = (user: IUser) => {
        setSelectedUser(user);
    };

    const handleClose = () => {
        setSelectedUser(null);
    };

    const getStatusDot = (uid: string) => {
        const userStatus = usersStatus.find(status => status.uid === uid);
        return userStatus?.online ? <span className={css.onlineDot}></span> : null;
    };



    return (
        <div className={css.usersContainer}>
            <div className={css.headerContainer}>
                <h3>People</h3>
                <UsersInviteWindow/>
            </div>

            <ul className={css.userList}>
                {filteredUsers.map((user) => (
                    <li key={user.uid} onClick={() => handleUserClick(user)}>
                        <div className={css.userItem}>
                            <div className={css.avatarContainer}>
                                <img
                                    src={user.picture || defaultAvatar}
                                    alt="User Avatar"
                                    className={css.avatar}
                                />
                                {getStatusDot(user.uid)}
                            </div>
                            <div className={css.userName}>
                                <p>{user.name}</p>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
            {selectedUser && (
                <div className={css.userDetails}>
                    <button className={css.closeButton} onClick={handleClose}>×</button>
                    <img
                        src={selectedUser.picture || defaultAvatar}
                        alt="User Avatar"
                        className={css.userDetailsAvatar}
                    />
                    <h2>{selectedUser.name}</h2>
                    <p className={css.label}>E-mail:</p>
                    <p className={css.userEmail}>{selectedUser.email}</p>
                    <p className={css.label}>Rooms:</p>
                </div>
            )}
        </div>
    );
};

export {UsersList};
