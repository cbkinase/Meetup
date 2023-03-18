import { useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getGroupInfo } from "../../store/groups";
import { getAllEvents } from "../../store/events";
import { NavLink } from "react-router-dom";
import OpenModalButton from "../OpenModalButton";
import DeleteGroupModal from "../DeleteGroup";
import AbridgedEventInfo from "../AbridgedEventInfo";

export default function SingleGroup() {
    const dispatch = useDispatch();
    const params = useParams();
    const groupId = params.groupId;
    const history = useHistory();
    let groupEvents = useSelector((state) => state.events.allEvents);
    let prevEvents = [];
    let futureEvents = [];
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
        console.log(futureEvents);
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
            console.log(futureEvents);
        }
        fetchData();
        dispatch(getGroupInfo(groupId));
    }, [dispatch]);

    const groupInfo = useSelector((state) => {
        if (groupId == state.groups.singleGroup.id)
            return state.groups.singleGroup;
        return {};
    });

    const handleJoinGroup = () => {
        alert("Feature coming soon");
    };
    const userInfo = useSelector((state) => state.session.user);

    if (Object.keys(groupInfo).length === 0) return <h1>Loading...</h1>;
    if (Object.keys(groupEvents).length === 0) return <h1>Loading...</h1>;

    let numAssociatedEvents = Object.values(groupEvents).filter((event) => {
        return event.groupId === +groupId;
    }).length;

    return (
        <div>
            <NavLink to="/groups">Groups</NavLink>
            <div>
                <img
                    src={
                        groupInfo.GroupImages.length > 0
                            ? groupInfo.GroupImages[0].url
                            : "NO IMAGE"
                    }
                ></img>
                <div>
                    <div>
                        <h1>{groupInfo.name}</h1>
                        <p>
                            {groupInfo.city}, {groupInfo.state}
                        </p>
                        <p>
                            {numAssociatedEvents}{" "}
                            {numAssociatedEvents === 1 ? "Event" : "Events"} ·{" "}
                            {groupInfo.type}
                        </p>
                        <p>
                            Organized by {groupInfo.Organizer.firstName}{" "}
                            {groupInfo.Organizer.lastName}
                        </p>
                    </div>
                    {!userInfo ? null : groupInfo.Organizer.id ===
                      userInfo.id ? (
                        <div>
                            <button
                                onClick={() => {
                                    history.push(
                                        `/groups/${groupId}/events/new`
                                    );
                                }}
                            >
                                Create event
                            </button>
                            <button
                                onClick={() =>
                                    history.push(`/groups/${groupId}/edit`)
                                }
                            >
                                Update
                            </button>
                            <OpenModalButton
                                buttonText="Delete"
                                modalComponent={
                                    <DeleteGroupModal groupId={groupId} />
                                }
                            ></OpenModalButton>
                        </div>
                    ) : (
                        <div>
                            <button onClick={handleJoinGroup}>
                                Join this Group
                            </button>
                        </div>
                    )}
                </div>
                <div>
                    <h2>Organizer</h2>
                    <p>
                        {groupInfo.Organizer.firstName}{" "}
                        {groupInfo.Organizer.lastName}
                    </p>
                    <h2>What we're about</h2>
                    <p>{groupInfo.about}</p>
                </div>
                {!groupEvents.length && (
                    <div>
                        <h2>No upcoming events!</h2>
                    </div>
                )}
                {futureEvents.length && (
                    <div>
                        <h2>Upcoming Events ({futureEvents.length})</h2>
                        {futureEvents.map((event) => (
                            <AbridgedEventInfo
                                event={event}
                            ></AbridgedEventInfo>
                        ))}
                    </div>
                )}
                {prevEvents.length && (
                    <div>
                        <h2>Past Events ({prevEvents.length})</h2>
                        {prevEvents.map((event) => (
                            <AbridgedEventInfo
                                event={event}
                            ></AbridgedEventInfo>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
