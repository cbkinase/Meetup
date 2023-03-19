import { useHistory } from "react-router-dom";
import "./AbridgedGroupInfo.css";

export default function AbridgedGroupInfo({ group, numEvents }) {
    const defaultImage =
        "https://content.instructables.com/FNF/7PUG/IRAVYHIC/FNF7PUGIRAVYHIC.jpg?auto=webp&frame=1&width=320&md=060c25d3f1bceaa6d309292040645220";
    const history = useHistory();
    const getDetailsOfGroup = (group) => {
        history.push(`/groups/${group.id}`);
    };

    const handleClick = () => {
        getDetailsOfGroup(group);
    };

    if (!Object.values(group).length) return null;
    return (
        <div className="group-info-container">
            <div className="group-info-subcontainer">
                <img
                    onClick={handleClick}
                    id="preview-image"
                    src={group.previewImage ? group.previewImage : defaultImage}
                    alt={`${group.name}`}
                ></img>
                <div onClick={handleClick} id="group-info">
                    <h2 id="group-name" className="group-attr">
                        {group.name}
                    </h2>
                    <p className="group-attr">
                        {group.type === "Online"
                            ? "Online"
                            : `${group.city}, ${group.state}`}
                    </p>
                    <p id="group-about" className="group-attr">
                        {group.about}
                    </p>
                    <p className="group-attr">
                        {numEvents === 1 ? `1 event` : `${numEvents} events`} ·{" "}
                        {group.private ? "Private" : "Public"}
                    </p>
                </div>
            </div>
        </div>
    );
}
