import React, { useState } from "react";
import { userService } from "../../../services";
import css from "./UsersInviteWindow.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const UsersInviteWindow = () => {
    const [isWindowVisible, setIsWindowVisible] = useState(false);
    const [isMultiInviteVisible, setIsMultiInviteVisible] = useState(false);
    const [email, setEmail] = useState<string>('');
    const [multiEmails, setMultiEmails] = useState<string>('');
    const [showInput, setShowInput] = useState(false);
    const inviteLink = 'http://localhost:3000/auth/register';

    const handleAddClick = () => {
        setIsWindowVisible(true);
        setIsMultiInviteVisible(false);
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
            toast.error('Please enter a valid email address.');
            return;
        }

        userService.inviteUserByEmail(email)
            .then(() => {
                toast.success('Invitation sent successfully!');
                setEmail('');
                setIsWindowVisible(false);
            })
            .catch(error => {
                console.error('Error sending invitation:', error);
                toast.error('Failed to send invitation. Please try again.');
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
            toast.error('Please enter at least one valid email address.');
            return;
        }

        Promise.all(emailsArray.map(email => userService.inviteUserByEmail(email)))
            .then(() => {
                toast.success('Invitations sent successfully!');
                setMultiEmails('');
                setIsWindowVisible(false);
            })
            .catch(error => {
                console.error('Error sending invitations:', error);
                toast.error('Failed to send invitations. Please try again.');
            });
    };

    const handleToggle = () => {
        setShowInput(prev => !prev);
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(inviteLink);
            toast.success('Link copied to clipboard!');
        } catch (error) {
            console.error('Failed to copy the link:', error);
            toast.error('Failed to copy the link. Please try again.');
        }
    };

    return (
        <div>
            <ToastContainer />
            <button className={css.addButton} onClick={handleAddClick}>+</button>
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
                    <div className={css.inviteContainer}>
                        <button className={css.inviteButton} onClick={handleInviteClick}>Invite</button>
                        <p>Invite with Link <label className={css.switch}>
                            <input type="checkbox" onChange={handleToggle}/>
                            <span className={css.slider}></span>
                        </label></p>
                    </div>
                    {showInput && (
                        <div className={css.linkContainer}>
                            <div className={css.divider2}>
                                <span className={css.line2}></span>
                            </div>
                            <div className={css.copyLinkContainer}>
                                <FontAwesomeIcon icon={faCopy} className={css.icon}/>
                                <input type="text"
                                       value={inviteLink} readOnly
                                       className={css.mailInput}
                                />
                                <button className={css.addButtonInsideInput} onClick={handleCopy}>Copy</button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export { UsersInviteWindow };
