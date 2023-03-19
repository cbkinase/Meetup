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
        <div>
            <h2>Confirm Delete</h2>
            <h3>Are you sure you want to remove this event?</h3>
            <button className="decorated-button" onClick={handleDelete}>
                Yes (Delete event)
            </button>
            <button className="decorated-button" onClick={closeModal}>
                No (Keep event)
            </button>
        </div>
    );
}
