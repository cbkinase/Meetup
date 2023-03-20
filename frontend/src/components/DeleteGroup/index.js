import { useModal } from "../../context/Modal";
import { destroyGroup } from "../../store/groups";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import "./DeleteGroup.css";

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
                Are you sure you want to remove this group?
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
                Yes (Delete Group)
            </button>
            <button
                style={{ width: "100%" }}
                className="decorated-button alt-color-button-2"
                onClick={closeModal}
            >
                No (Keep Group)
            </button>
        </div>
    );
}
