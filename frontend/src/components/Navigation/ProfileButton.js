import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";
import OpenModalMenuItem from "./OpenModalMenuItem";
// import LoginFormModal from "../LoginFormModal";
import NewLoginForm from "../LoginFormModal/NewLoginForm";
// import SignupFormModal from "../SignupFormModal";
import NewSignupForm from "../SignupFormModal/NewSignupForm";
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
                            <li style={{fontWeight: "bold"}}
                            // style={{
                            //     marginLeft: "4px",
                            //     overflowX: "hidden",
                            //     maxWidth: "85px",
                            // }}
                            >
                                {user.username}
                            </li>
                            <li
                            // style={{
                            //     maxWidth: "85px",
                            //     marginLeft: "4px",
                            //     overflowX: "hidden",
                            // }}
                            >
                                Hello, {user.firstName}
                            </li>
                            <li
                            // style={{
                            //     overflowX: "hidden",
                            //     maxWidth: "90px",
                            // }}
                            >
                                {/* {user.email} */}
                            </li>
                            <div style={{marginBottom: "4px"}} className="has-bottom-border"></div>
                            <li>
                                <NavLink
                                    style={{}}
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
                                    style={{}}
                                    onClick={closeMenu}
                                    className="menu-clickable"
                                    id="ve-link"
                                    to="/events"
                                >
                                    View events
                                </NavLink>
                            </li>
                            <div className="has-bottom-border"></div>
                            <li className="menu-clickable">
                                <button
                                    style={{
                                        fontWeight: "bold",
                                    }}
                                    className="decorated-button alt-color-button"
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
                                className="menu-clickable main-menu-user-interaction login-signup-button"
                                itemText="Log In"
                                id="login-button"
                                onItemClick={closeMenu}
                                modalComponent={<NewLoginForm />}
                            />
                            <OpenModalMenuItem
                                className="menu-clickable main-menu-user-interaction login-signup-button"
                                itemText="Sign Up"
                                onItemClick={closeMenu}
                                modalComponent={<NewSignupForm />}
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
