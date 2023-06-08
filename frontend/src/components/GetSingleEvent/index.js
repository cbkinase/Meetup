import { useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getEventInfo } from "../../store/events";
import { getGroupInfo } from "../../store/groups";
import { NavLink } from "react-router-dom";
import OpenModalButton from "../OpenModalButton";
import DeleteEventModal from "../DeleteEvent";
import "./GetSingleEvent.css";

export default function SingleEvent() {
    const params = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const eventId = params.eventId;

    useEffect(() => {
        dispatch(getEventInfo(eventId)).then((res) => {
            dispatch(getGroupInfo(res.groupId));
        });
    }, [dispatch]);

    const event = useSelector((state) => {
        if (eventId == state.events.singleEvent.id)
            return state.events.singleEvent;
        return {};
    });

    const group = useSelector((state) => {
        if (event.groupId == state.groups.singleGroup.id)
            return state.groups.singleGroup;
        return {};
    });

    const userInfo = useSelector((state) => state.session.user);

    if (Object.keys(event).length === 0) return null;
    if (Object.keys(group).length === 0) return null;

    let printStartDate = event.startDate.split("T");
    printStartDate = `${printStartDate[0]} · ${printStartDate[1].slice(
        0,
        -5
    )} (UTC)`;
    let printEndDate = event.endDate.split("T");
    printEndDate = `${printEndDate[0]} · ${printEndDate[1].slice(0, -5)} (UTC)`;

    let printVenue;
    if (event.Venue) {
        printVenue = `${event.Venue.address} - ${event.Venue.city}, ${event.Venue.state}`;
    } else if (event.type === "In person") {
        printVenue = "In person, no Venue specified";
    } else {
        printVenue = "Online";
    }

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div style={{ width: "600px" }}>
                <div className="main-single-event-container">
                    <div className="single-event-preamble">
                        <NavLink to="/events">
                            <i className="fa-regular fa-less-than"></i> Events
                        </NavLink>
                    </div>
                    <div className="single-event-header">
                        <h2 className="single-event-subheading">
                            {event.name}
                        </h2>
                        <p className="single-event-muted-text">
                            Hosted by {group.Organizer.firstName}{" "}
                            {group.Organizer.lastName}
                        </p>
                    </div>
                    <div className="single-event-main">
                        <img
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                    "https://secure.meetupstatic.com/next/images/fallbacks/group-cover-15-wide.webp";
                            }}
                            id="single-event-img"
                            src={
                                event.EventImages.length &&
                                event.EventImages[0].url
                            }
                            alt={event.name}
                        ></img>
                        <div id="group-of-event">
                            <div className="group-of-event-details">
                                <div>
                                    <img
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src =
                                                "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Image_not_available.png/640px-Image_not_available.png";
                                        }}
                                        id="group-of-event-img"
                                        src={
                                            group.GroupImages.length &&
                                            group.GroupImages[0].url
                                        }
                                        alt={group.name}
                                    ></img>
                                </div>
                                <div>
                                    <h3 id="group-name-event-detail">
                                        {group.name}
                                    </h3>
                                    <p className="single-event-muted-text">
                                        {group.private ? "Private" : "Public"}
                                    </p>
                                </div>
                            </div>
                            <div className="event-proper-information">
                                <div
                                    id="event-start-end"
                                    className="event-attr-with-icon"
                                >
                                    <div>
                                        <i className="fa-regular fa-clock space-icon-less"></i>
                                    </div>
                                    <div>
                                        <p>
                                            <span className="single-event-muted-text ">
                                                START
                                            </span>
                                            {"‎ ‎ ‎‎  "}
                                            <span className="event-date">
                                                {printStartDate}
                                            </span>
                                        </p>
                                        <p>
                                            <span className="single-event-muted-text ">
                                                END
                                            </span>
                                            {"‎ ‎ ‎ ‎ ‎ ‎ ‎ "}
                                            <span className="event-date">
                                                {printEndDate}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <div className="event-attr-with-icon">
                                    <div>
                                        <i className="fa-regular fa-dollar-sign space-icon"></i>
                                    </div>
                                    <div>
                                        <p className="single-event-muted-text">
                                            {event.price != 0
                                                ? `$${Number(
                                                    event.price
                                                ).toFixed(2)}`
                                                : "FREE"}
                                        </p>
                                    </div>
                                </div>
                                <div className="event-attr-with-icon">
                                    <div>
                                        <i className="fas fa-map-pin space-icon"></i>
                                    </div>
                                    <div className="stauts-and-buttons">
                                        <div>
                                            <p className="single-event-muted-text">
                                                {printVenue}
                                            </p>
                                        </div>
                                        <div id="space-buttons-event-page">
                                            {userInfo &&
                                                userInfo.id ===
                                                group.Organizer.id && (
                                                    <>
                                                        <button
                                                            id="edit-event-button"
                                                            className="decorated-button small-button"
                                                            onClick={() =>
                                                                history.push(`/groups/${group.id}/events/${eventId}/edit`)
                                                            }
                                                        >
                                                            Update
                                                        </button>
                                                        <OpenModalButton
                                                            className="decorated-button small-button"
                                                            buttonText="Delete"
                                                            modalComponent={
                                                                <DeleteEventModal
                                                                    groupId={
                                                                        group.id
                                                                    }
                                                                    eventId={
                                                                        eventId
                                                                    }
                                                                ></DeleteEventModal>
                                                            }
                                                        ></OpenModalButton>
                                                    </>
                                                )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="event-details-single">
                        <h2 className="single-event-subheading space-below-10">
                            Details
                        </h2>
                        <p>{event.description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
