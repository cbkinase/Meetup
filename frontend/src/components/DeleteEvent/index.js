import { useModal } from "../../context/Modal";
import { destroyEvent } from "../../store/events";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

export default function DeleteEventModal({ groupId, eventId }) {
    const { closeModal } = useModal();
    const history = useHistory();
    const dispatch = useDispatch();

    const handleDelete = async () => {
        await dispatch(destroyEvent(eventId));
        history.push(`/groups/${groupId}`);
        closeModal();
    };
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "10px 15px 10px 15px",
                border: "5px solid black",
            }}
        >
            <h2
                style={{
                    fontWeight: "bold",
                    fontSize: "22px",
                    marginBottom: "10px",
                }}
            >
                Confirm Delete
            </h2>
            <h3 style={{ fontWeight: "bold", marginBottom: "10px" }}>
                Are you sure you want to remove this event?
            </h3>
            <button
                style={{
                    marginBottom: "10px",
                    marginTop: "5px",
                    width: "100%",
                }}
                className="decorated-button"
                onClick={handleDelete}
            >
                Yes (Delete Event)
            </button>
            <button
                style={{ width: "100%" }}
                className="decorated-button alt-color-button-2"
                onClick={closeModal}
            >
                No (Keep Event)
            </button>
        </div>
    );
}
