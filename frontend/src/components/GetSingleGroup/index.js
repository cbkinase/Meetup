import { useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getGroupInfo } from "../../store/groups";
import { getAllEvents } from "../../store/events";
import { NavLink } from "react-router-dom";
import OpenModalButton from "../OpenModalButton";
import DeleteGroupModal from "../DeleteGroup";
import AbridgedEventInfo from "../AbridgedEventInfo";
import MembersInfo from "./MembersInfo";
import ManageMembers from "./ManageMembers";
import { csrfFetch } from "../../store/csrf";
import "./GetSingleGroup.css";

export default function SingleGroup() {
    const dispatch = useDispatch();
    const params = useParams();
    const groupId = params.groupId;
    const history = useHistory();
    let groupEvents = useSelector((state) => state.events.allEvents);
    let prevEvents = [];
    let futureEvents = [];

    function isInGroupAlready(user, group) {
        return group.Memberships.some(member => member.id === user.id && member.status !== "pending")
    }

    function isMembershipPending(user, group) {
        return group.Memberships.some(member => member.id === user.id && member.status === "pending")
    }

    function splitEvents(eventData) {
        prevEvents = [];
        futureEvents = [];
        eventData = Object.values(eventData).filter((event) => {
            return event.groupId === +groupId;
        });
        for (const event of eventData) {
            const currentTime = new Date();
            const comparisonDate = new Date(event.startDate);
            if (currentTime < comparisonDate) {
                futureEvents.push(event);
            } else {
                prevEvents.push(event);
            }
        }
        futureEvents.sort(
            (a, b) => Date.parse(a.startDate) - Date.parse(b.startDate)
        );
        prevEvents.sort(
            (a, b) => Date.parse(b.startDate) - Date.parse(a.startDate)
        );
    }
    splitEvents(groupEvents);
    useEffect(() => {
        async function fetchData() {
            let data = await dispatch(getAllEvents());
            groupEvents = Object.values(data).filter((event) => {
                return event.groupId === +groupId;
            });
            for (const event of groupEvents) {
                const currentTime = new Date();
                const comparisonDate = new Date(event.startDate);
                if (currentTime < comparisonDate) {
                    futureEvents.push(event);
                } else {
                    prevEvents.push(event);
                }
            }
            futureEvents.sort(
                (a, b) => Date.parse(a.startDate) - Date.parse(b.startDate)
            );
            prevEvents.sort(
                (a, b) => Date.parse(b.startDate) - Date.parse(a.startDate)
            );
        }
        fetchData();
        dispatch(getGroupInfo(groupId));
    }, [dispatch, groupId]);

    const groupInfo = useSelector((state) => {
        if (groupId == state.groups.singleGroup.id)
            return state.groups.singleGroup;
        return {};
    });

    const handleJoinGroup = () => {
        csrfFetch(`/api/groups/${groupId}/membership`, {
            method: "POST",
            // headers: { "Content-Type": "application/json" },
            // body: JSON.stringify({  })
        })
        alert("Membership requested");
    };

    const handleLeaveGroup = () => {
        csrfFetch(`/api/groups/${groupId}/membership`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ memberId: userInfo.id })
        })
        dispatch(getGroupInfo(groupId));
    }
    const userInfo = useSelector((state) => state.session.user);

    if (Object.keys(groupInfo).length === 0) return <h1>Loading...</h1>;
    if (Object.keys(groupEvents).length === 0) return <h1>Loading...</h1>;

    let numAssociatedEvents = Object.values(groupEvents).filter((event) => {
        return event.groupId === +groupId;
    }).length;

    return (
        <div className="main-single-group-container">
            <div id="return-to-groups">
                <NavLink to="/groups">
                    <i className="fa-regular fa-less-than"></i> Groups
                </NavLink>
            </div>
            <div>
                <div id="group-detail-container">
                    <img
                        id="group-detail-img"
                        alt={groupInfo.name}
                        src={
                            groupInfo.GroupImages.length > 0
                                ? groupInfo.GroupImages[0].url
                                : "NO IMAGE"
                        }
                    ></img>
                    <div id="group-detail-text">
                        <h1>{groupInfo.name}</h1>
                        <p>
                            {groupInfo.city}, {groupInfo.state}
                        </p>
                        <p>
                            {numAssociatedEvents}{" "}
                            {numAssociatedEvents === 1 ? "Event" : "Events"} ·{" "}
                            {groupInfo.private ? "Private" : "Public"}
                        </p>
                        <p>
                            Organized by {groupInfo.Organizer.firstName}{" "}
                            {groupInfo.Organizer.lastName}
                        </p>
                        {!userInfo ? null : groupInfo.Organizer.id ===
                          userInfo.id ? (
                            <div>
                                <button
                                    className="decorated-button small-button"
                                    onClick={() => {
                                        history.push(
                                            `/groups/${groupId}/events/new`
                                        );
                                    }}
                                >
                                    Create event
                                </button>
                                <button
                                    className="decorated-button small-button"
                                    onClick={() =>
                                        history.push(`/groups/${groupId}/edit`)
                                    }
                                >
                                    Update
                                </button>
                                <OpenModalButton
                                    className="decorated-button small-button"
                                    buttonText="Delete"
                                    modalComponent={
                                        <DeleteGroupModal groupId={groupId} />
                                    }
                                ></OpenModalButton>
                                <OpenModalButton
                                    className="decorated-button small-button"
                                    buttonText="Manage Members"
                                    modalComponent={<ManageMembers group={groupInfo} user={userInfo} />} />
                            </div>
                        ) :
                        isInGroupAlready(userInfo, groupInfo)
                        ? <div>
                        <button
                            className="decorated-button small-button"
                            onClick={handleLeaveGroup}
                        >
                            Leave this Group
                        </button>
                    </div>
                        :
                        isMembershipPending(userInfo, groupInfo)
                        ? null
                        : (
                            <div>
                                <button
                                    className="decorated-button small-button"
                                    onClick={handleJoinGroup}
                                >
                                    Join this Group
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <MembersInfo group={groupInfo} />
                <div id="group-spiel">
                    <div>
                        <h2 className="organizer-label-group g-about-label">
                            Organizer
                        </h2>
                        <p id="organizer-fn-ln-desc">
                            {groupInfo.Organizer.firstName}{" "}
                            {groupInfo.Organizer.lastName}
                        </p>
                    </div>
                    <div>
                        <h2 className="organizer-label-group g-about-label">
                            What we're about
                        </h2>
                        <p id="group-desc-mid">{groupInfo.about}</p>
                    </div>
                </div>
                {prevEvents.length === 0 && futureEvents.length === 0 ? (
                    <div>
                        <h2 className="organizer-label-group event-time-descriptor">
                            No upcoming events!
                        </h2>
                    </div>
                ) : null}
                {futureEvents.length ? (
                    <div>
                        <h2 className="organizer-label-group event-time-descriptor">
                            Upcoming Events ({futureEvents.length})
                        </h2>
                        {futureEvents.map((event) => (
                            <AbridgedEventInfo
                            key={event.id}
                                event={event}
                            ></AbridgedEventInfo>
                        ))}
                    </div>
                ) : null}
                {prevEvents.length ? (
                    <div id="past-events">
                        <h2 className="organizer-label-group event-time-descriptor">
                            Past Events ({prevEvents.length})
                        </h2>
                        {prevEvents.map((event) => (
                            <AbridgedEventInfo
                            key={event.id}
                                event={event}
                            ></AbridgedEventInfo>
                        ))}
                    </div>
                ) : null}
            </div>
        </div>
    );
}
