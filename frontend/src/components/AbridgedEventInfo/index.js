import "./AbridgedEventInfo.css";
import { useHistory } from "react-router-dom";

export default function AbridgedEventInfo({ event }) {
    const defaultImage =
        "https://content.instructables.com/FNF/7PUG/IRAVYHIC/FNF7PUGIRAVYHIC.jpg?auto=webp&frame=1&width=320&md=060c25d3f1bceaa6d309292040645220";
    const history = useHistory();

    const getDetailsOfEvent = (event) => {
        history.push(`/events/${event.id}`);
    };

    const handleClick = () => {
        getDetailsOfEvent(event);
    };

    let printDate = event.startDate.split("T");
    printDate = `${printDate[0]} · ${printDate[1].slice(0, -5)} (UTC)`;
    let printVenue;
    if (event.Venue) {
        printVenue = `${event.Venue.city}, ${event.Venue.state}`;
    } else if (event.type === "In person") {
        printVenue = "In person, no Venue specified";
    } else {
        printVenue = "Online";
    }

    return (
        <div className="main-event-container">
            <div className="event-subcontainer">
                <div onClick={handleClick} id="add-ev-img-pad">
                    <img
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                                "https://secure.meetupstatic.com/next/images/fallbacks/group-cover-15-wide.webp";
                        }}
                        onClick={handleClick}
                        className="event-image"
                        alt={event.name}
                        src={
                            event.previewImage
                                ? event.previewImage
                                : defaultImage
                        }
                    ></img>
                </div>
                <div className="event-actual-info" onClick={handleClick}>
                    <h3 id="abg-event-date">{printDate}</h3>
                    <h2 id="abg-event-name">{event.name}</h2>
                    <p className="abg-event-venue">{printVenue}</p>
                    <p style={{ marginTop: "10px", overflowWrap: "break-word" }}>{event.description}</p>
                </div>
            </div>
        </div>
    );
}
