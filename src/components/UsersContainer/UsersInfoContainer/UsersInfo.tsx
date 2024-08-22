import React from 'react';
import css from './UsersInfo.module.css'; // Create and style this CSS module

interface UsersInfoProps {
    user: {
        uid: string;
        name: string;
        email: string;
        picture?: string;
    } | null;
    onClose: () => void;
}

const UsersInfo: React.FC<UsersInfoProps> = ({ user, onClose }) => {
    if (!user) return null;

    return (
        <div className={css.usersInfoContainer}>
            <div className={css.overlay} onClick={onClose}></div>
            <div className={css.userInfoCard}>
                <button className={css.closeButton} onClick={onClose}>X</button>
                <img src={user.picture || '/path-to-default-avatar'} alt="User Avatar" className={css.avatar} />
                <h3>{user.name}</h3>
                <p>{user.email}</p>
                {/* Add more user info as needed */}
            </div>
        </div>
    );
};

export { UsersInfo };
