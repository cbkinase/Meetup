import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import { NavLink } from "react-router-dom";
import "./Navigation.css";

function ProfileButton({ user }) {
    const dispatch = useDispatch();
    const history = useHistory();
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();

    const openMenu = () => {
        if (showMenu) return;
        const self = document.getElementsByClassName("nav-container")[0];
        self.style.borderBottom = "none";
        setShowMenu(true);
    };

    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = (e) => {
            if (!ulRef.current.contains(e.target)) {
                setShowMenu(false);
                const self =
                    document.getElementsByClassName("nav-container")[0];
                self.style.borderBottom = "1px solid rgb(103, 102, 102)";
            }
        };

        document.addEventListener("click", closeMenu);

        return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);

    const closeMenu = () => {
        const self = document.getElementsByClassName("nav-container")[0];
        self.style.borderBottom = "1px solid rgb(103, 102, 102)";
        setShowMenu(false);
    };

    const logout = (e) => {
        e.preventDefault();
        const self = document.getElementsByClassName("nav-container")[0];
        self.style.borderBottom = "1px solid rgb(103, 102, 102)";
        dispatch(sessionActions.logout());
        closeMenu();
        history.push("/");
    };

    const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

    return (
        <>
            <button className="main-dropdown-button" onClick={openMenu}>
                <i
                    className="fas fa-user-circle"
                    style={{
                        marginRight: "7px",
                        color: "#000000",
                        fontSize: "20px",
                    }}
                />
                <i
                    className={
                        !showMenu
                            ? "fa-solid fa-chevron-down"
                            : "fa-solid fa-chevron-up"
                    }
                    style={{
                        fontSize: "16px",
                        color: "#000000",
                        marginLeft: "7px",
                    }}
                />
            </button>
            <ul className={ulClassName} ref={ulRef}>
                {user ? (
                    <>
                        <div className="dropdown-items-a">
                            <li>{user.username}</li>
                            <li>Hello, {user.firstName}</li>
                            <li>{user.email}</li>
                            <li>
                                <NavLink
                                    onClick={closeMenu}
                                    className="menu-clickable"
                                    id="vg-link"
                                    to="/groups"
                                >
                                    View groups
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    onClick={closeMenu}
                                    className="menu-clickable"
                                    id="ve-link"
                                    to="/events"
                                >
                                    View events
                                </NavLink>
                            </li>
                            <li className="menu-clickable">
                                <button
                                    className="decorated-button"
                                    onClick={logout}
                                >
                                    Log Out
                                </button>
                            </li>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="dropdown-items-a">
                            <OpenModalMenuItem
                                className="menu-clickable main-menu-user-interaction"
                                itemText="Log In"
                                onItemClick={closeMenu}
                                modalComponent={<LoginFormModal />}
                            />
                            <OpenModalMenuItem
                                className="menu-clickable main-menu-user-interaction"
                                itemText="Sign Up"
                                onItemClick={closeMenu}
                                modalComponent={<SignupFormModal />}
                            />
                            <li>
                                <NavLink
                                    onClick={closeMenu}
                                    className="menu-clickable"
                                    id="vg-link"
                                    to="/groups"
                                >
                                    View groups
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    onClick={closeMenu}
                                    className="menu-clickable"
                                    id="ve-link"
                                    to="/events"
                                >
                                    View events
                                </NavLink>
                            </li>
                        </div>
                    </>
                )}
            </ul>
        </>
    );
}

export default ProfileButton;
