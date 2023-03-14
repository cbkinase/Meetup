import { NavLink } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import OpenModalButton from "../OpenModalButton/";
import SignupFormModal from "../SignupFormModal";
import "./Homepage.css";

export default function Homepage() {
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();

    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = (e) => {
            if (!ulRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener("click", closeMenu);

        return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);

    const closeMenu = () => setShowMenu(false);
    return (
        <div id="main-homepage-container">
            <div id="section-1">
                <div id="section-1-text">
                    <h1 id="main-intro">
                        The people platform —Where interests become friendships
                    </h1>
                    <p>
                        Whatever your interest, from hiking and reading to
                        networking and skill sharing, there are thousands of
                        people who share it on Meetup. Events are happening
                        every day—log in to join the fun.
                    </p>
                </div>
                <img
                    id="section-1-image"
                    src="https://secure.meetupstatic.com/next/images/shared/online_events.svg?w=640"
                ></img>
            </div>
            <div id="section-2">
                <h2 id="section-2-heading">How Meetup Works</h2>
                <p>
                    Meet new people who share your interests through online and
                    in-person events. It's free to create an account.
                </p>
            </div>
            <div id="section-3">
                <div>
                    <div>
                        <img src="https://secure.meetupstatic.com/next/images/shared/handsUp.svg?w=256"></img>
                    </div>
                    <NavLink to="/groups">Join a group</NavLink>
                    <p>
                        Do what you love, meet others who love it, find your
                        community. The rest is history!
                    </p>
                </div>
                <div id="section-3-middle">
                    <div>
                        <img src="https://secure.meetupstatic.com/next/images/shared/ticket.svg?w=256"></img>
                    </div>
                    <NavLink to="/events">Find an event</NavLink>
                    <p>
                        Events are happening on just about any topic you can
                        think of, from online gaming and photography to yoga and
                        hiking.
                    </p>
                </div>
                <div>
                    <div>
                        <img src="https://secure.meetupstatic.com/next/images/shared/joinGroup.svg?w=256"></img>
                    </div>
                    <NavLink to="/FIXME">Start a group</NavLink>
                    <p>
                        You don’t have to be an expert to gather people together
                        and explore shared interests.
                    </p>
                </div>
            </div>
            <div id="section-4">
                <OpenModalButton
                    buttonText="Join Meetup"
                    onItemClick={closeMenu}
                    modalComponent={<SignupFormModal />}
                ></OpenModalButton>
            </div>
        </div>
    );
}
