import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import css from './UsersInfo.module.css';
import defaultAvatar from '../../../assets/defaultAvatar.png';
import { RootState } from "../../../store";
import { userActions } from "../../../store/slices/userSlice";

const UsersInfo: React.FC = () => {
    const dispatch = useDispatch();
    const selectedUser = useSelector((state: RootState) => state.user.selectedUser);

    if (!selectedUser) {
        return null;
    }

    const handleClose = () => {
        dispatch(userActions.clearSelectedUser());
    };

    return (
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
            {/* Додайте додаткові дані користувача тут */}
        </div>
    );
};

export { UsersInfo };
