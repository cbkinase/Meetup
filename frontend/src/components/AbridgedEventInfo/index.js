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
    printDate = `${printDate[0]} · ${printDate[1].slice(0, -5)}`;
    let printVenue;
    if (event.Venue && event.Venue.length) {
        printVenue = `${event.Venue.city}, ${event.Venue.state}`;
    } else if (event.type === "In person") {
        printVenue = "In person, no Venue specified";
    } else {
        printVenue = "Online";
    }

    return (
        <div className="main-event-container">
            <div className="event-subcontainer">
                <div id="add-ev-img-pad">
                    <img
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
                    <h3>{printDate}</h3>
                    <h2>{event.name}</h2>
                    <p>{printVenue}</p>
                </div>
            </div>
        </div>
    );
}
