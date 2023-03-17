import "./AbridgedEventInfo.css";
import { useHistory } from "react-router-dom";

export default function AbridgedEventInfo({ event }) {
    const history = useHistory();

    const getDetailsOfEvent = (event) => {
        history.push(`/events/${event.id}`);
    };

    const handleClick = () => {
        getDetailsOfEvent(event);
    };

    let printDate = event.startDate.split("T");
    printDate = `${printDate[0]} · ${printDate[1].slice(0, -5)}`;

    return (
        <div className="main-event-container">
            <div className="event-subcontainer">
                <div>
                    <img
                        onClick={handleClick}
                        className="event-image"
                        alt={event.name}
                        src={event.previewImage}
                    ></img>
                </div>
                <div className="event-actual-info" onClick={handleClick}>
                    <h3>{printDate}</h3>
                    <h2>{event.name}</h2>
                    <p>
                        {event.Venue
                            ? `${event.Venue.city}, ${event.Venue.state}`
                            : "ONLINE"}
                    </p>
                </div>
            </div>
        </div>
    );
}
