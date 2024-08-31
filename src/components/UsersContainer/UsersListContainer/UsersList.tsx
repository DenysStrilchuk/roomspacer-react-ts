import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import css from './UsersList.module.css';
import {useAppDispatch} from "../../../hooks";
import {RootState} from "../../../store";
import {userActions} from "../../../store/slices/userSlice";
import defaultAvatar from '../../../assets/defaultAvatar.png';
import {IUser} from "../../../interfaces";
import {userService} from "../../../services";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEnvelope} from "@fortawesome/free-solid-svg-icons";

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
    const [isWindowVisible, setIsWindowVisible] = useState(false);
    const [isMultiInviteVisible, setIsMultiInviteVisible] = useState(false);
    const [email, setEmail] = useState<string>('');
    const [multiEmails, setMultiEmails] = useState<string>('');

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

    const handleAddClick = () => {
        setIsWindowVisible(true);
        setIsMultiInviteVisible(false); // показуємо початкову форму
    };

    const handleCloseModal = () => {
        setIsWindowVisible(false);
        setIsMultiInviteVisible(false);
    };

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const handleAddEmailClick = () => {
        if (email.trim() === '') {
            alert('Please enter a valid email address.');
            return;
        }

        userService.inviteUserByEmail(email)
            .then(() => {
                alert('Invitation sent successfully!');
                setEmail('');
                setIsWindowVisible(false);
            })
            .catch(error => {
                console.error('Error sending invitation:', error);
                alert('Failed to send invitation. Please try again.');
            });
    };

    const handleMultiInviteClick = () => {
        setIsMultiInviteVisible(true);
    };

    const handleMultiEmailsChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMultiEmails(event.target.value);
    };

    const handleInviteClick = () => {
        const emailsArray = multiEmails.split(/[\s,]+/).filter(email => email.includes('@'));
        if (emailsArray.length === 0) {
            alert('Please enter at least one valid email address.');
            return;
        }

        Promise.all(emailsArray.map(email => userService.inviteUserByEmail(email)))
            .then(() => {
                alert('Invitations sent successfully!');
                setMultiEmails('');
                setIsWindowVisible(false);
            })
            .catch(error => {
                console.error('Error sending invitations:', error);
                alert('Failed to send invitations. Please try again.');
            });
    };

    return (
        <div className={css.usersContainer}>
            <div className={css.headerContainer}>
                <h3>People</h3>
                <button className={css.addButton} onClick={handleAddClick}>+</button>
            </div>
            {isWindowVisible && (
                <div className={css.modalWindow}>
                    <div className={css.closeModalButton} onClick={handleCloseModal}>×</div>
                    <p className={css.inviteText}>Invite people to collaborate</p>
                    {!isMultiInviteVisible ? (
                        <>
                            <div className={css.inputContainer}>
                                <FontAwesomeIcon icon={faEnvelope} className={css.icon}/>
                                <input
                                    type="email"
                                    placeholder="e.g. name@mail.com"
                                    required
                                    value={email}
                                    onChange={handleEmailChange}
                                    className={css.mailInput}
                                />
                                <button className={css.addButtonInsideInput} onClick={handleAddEmailClick}>Add</button>
                            </div>
                            <div className={css.multiInviteContainer}>
                                <span className={css.staticText}>Big team? </span>
                                <span className={css.multiInviteLink} onClick={handleMultiInviteClick}>
                                        Add many people at once
                                </span>
                            </div>
                        </>
                    ) : (
                        <>
                            <p className={css.multiInviteText}>Invite people via email</p>
                            <textarea
                                placeholder="Separate by hitting comma or enter"
                                value={multiEmails}
                                onChange={handleMultiEmailsChange}
                                className={css.multiEmailInput}
                            />
                        </>
                    )}
                    <div className={css.divider}>
                        <span className={css.line}></span>
                    </div>
                    <div>
                        <button className={css.inviteButton} onClick={handleInviteClick}>Invite</button>
                    </div>
                </div>
            )}
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
