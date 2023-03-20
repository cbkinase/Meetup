import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { getGroupInfo } from "../../store/groups";
import { useHistory, useParams } from "react-router-dom";
import { createEvent, createEventImage } from "../../store/events";
import "./CreateEvent.css";

export default function CreateEventForm() {
    const dispatch = useDispatch();
    const params = useParams();
    const history = useHistory();
    const user = useSelector((state) => state.session.user);
    if (!user) {
        history.push("/");
    }

    const group = useSelector((state) => {
        if (params.groupId == state.groups.singleGroup.id)
            return state.groups.singleGroup;
        return {};
    });

    const [eventName, setEventName] = useState("");
    const [eventType, setEventType] = useState("");
    const [eventPrice, setEventPrice] = useState(0);
    const [eventStart, setEventStart] = useState("");
    const [eventEnd, setEventEnd] = useState("");
    const [eventImage, setEventImage] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const [eventCapacity, setEventCapacity] = useState(10);
    // const [eventVenueId, setEventVenueId] = useState(1);
    const [errors, setErrors] = useState({});
    const [hasSubmitted, setHasSubmitted] = useState(false);

    // Set page title and reset upon leaving the page

    useEffect(() => {
        const prevTitle = document.title;
        // In case they come into the page without the store pre-loaded
        dispatch(getGroupInfo(params.groupId)).then((res) => {
            if (user.id !== res.Organizer.id) {
                history.push(`/groups/${params.groupId}`);
            }
            document.title = `Create an event for ${res.name}`;
        });

        return () => {
            document.title = prevTitle;
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        let err = {};

        if (eventName.length === 0) {
            err.name = "Name is required";
        }
        if (eventPrice.length === 0) {
            err.price = "Price is required";
        }
        if (eventStart.length === 0) {
            err.startDate = "Event start is required";
        }
        if (eventEnd.length === 0) {
            err.endDate = "Event end is required";
        }

        if (!eventType) err.type = "Event Type is required";
        if (
            !eventImage.endsWith(".png") &&
            !eventImage.endsWith(".jpg") &&
            !eventImage.endsWith(".jpeg")
        )
            err.image = "Image URL must end in .png, .jpg, or .jpeg";
        if (eventDescription.length < 30)
            err.description = "Description must be at least 30 characters long";

        const payload = {
            // venueId: eventVenueId,
            venueId: null,
            name: eventName,
            type: eventType,
            capacity: eventCapacity,
            price: eventPrice,
            description: eventDescription,
            startDate: eventStart,
            endDate: eventEnd,
        };
        setHasSubmitted(true);
        if (Object.keys(err).length) {
            setErrors(err);
            return;
        }
        const newEvent = await dispatch(
            createEvent(payload, params.groupId)
        ).catch(async (res) => {
            setHasSubmitted(true);
            const data = await res.json();
            if (data && data.errors) setErrors({ ...data.errors, ...err });
        });
        if (newEvent) {
            await dispatch(createEventImage(newEvent.id, eventImage, true));
            history.push(`/events/${newEvent.id}`);
        }
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                marginLeft: "60px",
                marginRight: "60px",
            }}
        >
            <h1 className="create-group-subheading event-create-spacing">
                Create an event for "{group.name}"
            </h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <p className="decorated-event-create-text">
                        What is the name of your event?
                    </p>
                    <input
                        className="color-input"
                        onChange={(e) => setEventName(e.target.value)}
                        placeholder="Event Name"
                    ></input>
                    {hasSubmitted && errors.name && (
                        <p className="errors">*{errors.name}</p>
                    )}
                </div>
                <div className="has-bottom-border"></div>
                <div>
                    <div>
                        <label
                            className="decorated-event-create-text"
                            htmlFor="type"
                        >
                            Is this an in person or online event?
                            <br></br>
                        </label>
                        <select
                            className="color-input"
                            onChange={(e) => setEventType(e.target.value)}
                            id="type"
                            name="type"
                        >
                            <option value="">(select one)</option>
                            <option value="Online">Online</option>
                            <option value="In person">In person</option>
                        </select>
                        {hasSubmitted && errors.type && (
                            <p className="errors">*{errors.type}</p>
                        )}
                    </div>
                    <div>
                        <p className="decorated-event-create-text">
                            What is the price for your event?
                        </p>
                        <input
                            className="color-input"
                            defaultValue={0}
                            onChange={(e) => setEventPrice(e.target.value)}
                            type="number"
                            min="0"
                            max="10000000"
                        ></input>
                        {hasSubmitted && errors.price && (
                            <p className="errors">*{errors.price}</p>
                        )}
                    </div>
                    <div className="has-bottom-border"></div>
                </div>
                <div>
                    <div>
                        <p className="decorated-event-create-text">
                            When does your event start?
                        </p>
                        <p className="other-create-event-decorated-text">
                            Please note that all times are expressed in UTC.
                        </p>
                        <input
                            className="color-input"
                            onChange={(e) => setEventStart(e.target.value)}
                            type="datetime-local"
                        ></input>
                    </div>
                    {hasSubmitted && errors.startDate && (
                        <p className="errors">*{errors.startDate}</p>
                    )}
                    <div>
                        <p className="decorated-event-create-text">
                            When does your event end?
                        </p>
                        <p className="other-create-event-decorated-text">
                            Please note that all times are expressed in UTC.
                        </p>
                        <input
                            className="color-input"
                            onChange={(e) => setEventEnd(e.target.value)}
                            type="datetime-local"
                        ></input>
                        {hasSubmitted && errors.endDate && (
                            <p className="errors">*{errors.endDate}</p>
                        )}
                    </div>
                    <div className="has-bottom-border"></div>
                </div>
                <div>
                    <div>
                        <p className="decorated-event-create-text">
                            Please add an image url for your event below:
                        </p>
                        <input
                            className="color-input"
                            onChange={(e) => setEventImage(e.target.value)}
                            placeholder="Image URL"
                        ></input>
                        {hasSubmitted && errors.image && (
                            <p className="errors">*{errors.image}</p>
                        )}
                    </div>
                    <div className="has-bottom-border"></div>
                </div>
                <div>
                    <div>
                        <p className="decorated-event-create-text">
                            Please describe your event:
                        </p>
                        <textarea
                            id="create-event-about"
                            className="color-input"
                            onChange={(e) =>
                                setEventDescription(e.target.value)
                            }
                            placeholder="Please include at least 30 characters"
                        ></textarea>
                        {hasSubmitted && errors.description && (
                            <p className="errors">*{errors.description}</p>
                        )}
                    </div>
                </div>
                <button
                    style={{ fontWeight: "bold" }}
                    className="decorated-button button-needs-adjustment"
                    id="submit"
                    type="submit"
                >
                    Create Event
                </button>
            </form>
        </div>
    );
}
