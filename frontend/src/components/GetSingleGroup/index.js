import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getGroupInfo } from "../../store/groups";
import { NavLink } from "react-router-dom";

export default function SingleGroup() {
    const dispatch = useDispatch();
    const params = useParams();
    const groupId = params.groupId;

    useEffect(() => {
        dispatch(getGroupInfo(groupId));
    }, [dispatch]);

    const groupInfo = useSelector((state) => {
        if (groupId == state.groups.singleGroup.id)
            return state.groups.singleGroup;
        return {};
    });

    const handleJoinGroup = () => {
        alert("Feature coming soon");
    };
    const userInfo = useSelector((state) => state.session.user);

    if (Object.keys(groupInfo).length === 0) return null;

    return (
        <div>
            <NavLink to="/groups">Groups</NavLink>
            <div>
                <img
                    src={
                        groupInfo.GroupImages.length > 0
                            ? groupInfo.GroupImages[0]
                            : "NO IMAGE"
                    }
                ></img>
                <div>
                    <div>
                        <h1>{groupInfo.name}</h1>
                        <p>
                            {groupInfo.city}, {groupInfo.state}
                        </p>
                        <p>FIXME: ## events · {groupInfo.type}</p>
                        <p>
                            Organized by {groupInfo.Organizer.firstName}{" "}
                            {groupInfo.Organizer.lastName}
                        </p>
                    </div>
                    {!userInfo ? null : groupInfo.Organizer.id ===
                      userInfo.id ? (
                        <div>
                            <button>Create event</button>
                            <button>Update</button>
                            <button>Delete</button>
                        </div>
                    ) : (
                        <div>
                            <button onClick={handleJoinGroup}>
                                Join this Group
                            </button>
                        </div>
                    )}
                </div>
                <div>
                    <h2>Organizer</h2>
                    <p>
                        {groupInfo.Organizer.firstName}{" "}
                        {groupInfo.Organizer.lastName}
                    </p>
                    <h2>What we're about</h2>
                    <p>{groupInfo.about}</p>
                </div>
                <div>
                    <h2>FIXME: Upcoming Events</h2>
                </div>
            </div>
        </div>
    );
}
