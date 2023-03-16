import { useModal } from "../../context/Modal";
import { destroyGroup } from "../../store/groups";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

export default function DeleteGroupModal({ groupId }) {
    const { closeModal } = useModal();
    const history = useHistory();
    const dispatch = useDispatch();

    const handleDelete = async () => {
        await dispatch(destroyGroup(groupId));
        history.push("/groups");
        closeModal();
    };
    return (
        <div>
            <h2>Confirm Delete</h2>
            <h3>Are you sure you want to remove this group?</h3>
            <button onClick={handleDelete}>Yes(Delete Group)</button>
            <button onClick={closeModal}>No (Keep Group)</button>
        </div>
    );
}
