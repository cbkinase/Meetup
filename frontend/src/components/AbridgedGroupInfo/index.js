import { useHistory } from "react-router-dom";
import "./AbridgedGroupInfo.css";

export default function AbridgedGroupInfo({ group }) {
    const defaultImage =
        "https://content.instructables.com/FNF/7PUG/IRAVYHIC/FNF7PUGIRAVYHIC.jpg?auto=webp&frame=1&width=320&md=060c25d3f1bceaa6d309292040645220";
    const history = useHistory();
    const getDetailsOfGroup = (group) => {
        history.push(`/groups/${group.id}`);
    };

    if (!Object.values(group).length) return null;
    return (
        <div className="main-group-container">
            <div className="group-info-container">
                <img
                    id="preview-image"
                    src={group.previewImage ? group.previewImage : defaultImage}
                    alt={`${group.name}`}
                ></img>
                <div id="group-info">
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
                        FIXME: ## Events ·{" "}
                        {group.private ? "Private" : "Public"}
                    </p>
                </div>
            </div>
        </div>
    );
}
