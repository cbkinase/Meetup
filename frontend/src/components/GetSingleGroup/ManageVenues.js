import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { csrfFetch } from "../../store/csrf";
import { useModal } from "../../context/Modal";
import { getGroupInfo } from "../../store/groups";
import Popup from "../Popup";
import "./ManageVenues.css";

export default function ManageVenues({ user, group }) {
    const dispatch = useDispatch();
    const [vens, setVens] = useState(group.Venues);
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const { closeModal } = useModal();

    useEffect(() => {
        if (showPopup) {
            const timer = setTimeout(() => {
                setShowPopup(false);
            }, 4900);

            return () => clearTimeout(timer);
        }
    }, [showPopup]);

    const onSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            "address": address,
            "city": city,
            "state": state,
            "lat": 0,
            "lng": 0,
        }
        try {
            const res = await csrfFetch(`/api/groups/${group.id}/venues`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })
            const info = await dispatch(getGroupInfo(group.id));
            setVens(info.Venues);
            setAddress("");
            setCity("");
            setState("");
        }
        catch {
            setShowPopup(true);
        }
    }

    const handleDelete = async (venue) => {
        try {
            await csrfFetch(`/api/venues/${venue.id}`, {
                method: "DELETE",
            })
            const info = await dispatch(getGroupInfo(group.id));
            setVens(info.Venues);
        } catch (error) {
            setShowPopup(true);
        }
    }
    return (
        <div className="venue-container">
            {showPopup && (
                <Popup textTitle={"Something went wrong!"} textBody={"Please try again later."} />
            )}
            <h2 className="venue-title">Venue Management</h2>
            <button className="modal-close-btn" onClick={() => closeModal()}>
                <i className="fa-solid fa-x"></i>
            </button>
            <form onSubmit={onSubmit}>
                <div className="venue-form-group">
                    <label htmlFor="venue-address">Venue Address</label>
                    <input
                        type="text"
                        id="venue-address"
                        placeholder="Enter address"
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                        required />
                </div>
                <div className="venue-form-group">
                    <label htmlFor="venue-city">City</label>
                    <input
                        type="text"
                        id="venue-city"
                        placeholder="Enter city"
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        required />
                </div>
                <div className="venue-form-group">
                    <label htmlFor="venue-state">State</label>
                    <input
                        type="text"
                        id="venue-state"
                        placeholder="Enter state"
                        value={state}
                        onChange={e => setState(e.target.value)}
                        required />
                </div>
                <div className="venue-form-group">
                    <button type="submit">Add Venue</button>
                </div>
            </form>

            <h3>Venue List</h3>
            <ul className="venue-list">
                {vens.sort((a, b) => b.id - a.id).map(venue => (
                    <li key={venue.id}>
                        <div>
                            <h3>{venue.address}</h3>
                            <p>{venue.city}, {venue.state}</p>
                        </div>
                        <div>
                            {/* <button>Edit</button> */}
                            <button onClick={e => handleDelete(venue)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}
