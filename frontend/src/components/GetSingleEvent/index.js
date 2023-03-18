import { useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getEventInfo } from "../../store/events";
import { getGroupInfo } from "../../store/groups";
import { NavLink } from "react-router-dom";
import OpenModalButton from "../OpenModalButton";
import DeleteEventModal from "../DeleteEvent";

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
    printStartDate = `${printStartDate[0]} · ${printStartDate[1].slice(0, -5)}`;
    let printEndDate = event.endDate.split("T");
    printEndDate = `${printEndDate[0]} · ${printEndDate[1].slice(0, -5)}`;

    return (
        <div>
            <NavLink to="/events">Events</NavLink>
            <h2>{event.name}</h2>
            <p>
                Hosted by {group.Organizer.firstName} {group.Organizer.lastName}
            </p>
            <div>
                <img
                    src={event.EventImages.length && event.EventImages[0].url}
                    alt={event.name}
                ></img>
                <div>
                    <div>
                        <img
                            src={
                                group.GroupImages.length && group.GroupImages[0]
                            }
                            alt={group.name}
                        ></img>
                        <h3>{group.name}</h3>
                    </div>
                    <div>
                        <div>
                            <p>START {printStartDate}</p>
                            <p>END {printEndDate}</p>
                        </div>
                        <div>
                            <p>{event.price ? event.price : "FREE"}</p>
                        </div>
                        <div>
                            <p>{event.type}</p>
                            {userInfo && userInfo.id === group.Organizer.id && (
                                <OpenModalButton
                                    buttonText="Delete"
                                    modalComponent={
                                        <DeleteEventModal
                                            groupId={group.id}
                                            eventId={eventId}
                                        ></DeleteEventModal>
                                    }
                                ></OpenModalButton>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <h2>Details</h2>
            <p>{event.description}</p>
        </div>
    );
}
