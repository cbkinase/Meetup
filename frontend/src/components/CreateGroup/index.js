import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { createGroup, createGroupImage } from "../../store/groups";
import { useHistory, useParams } from "react-router-dom";

export default function CreateGroupForm({ isUpdating }) {
    // Rather than using the 'isUpdating' boolean, it might make more sense to
    // Just check params.groupId
    const dispatch = useDispatch();
    const params = useParams();
    const groupId = params.groupId;
    const groupInfo = useSelector((state) => {
        // if (groupId == state.groups.singleGroup.id)
        return state.groups.singleGroup;
        return null;
    });
    let loc = null;
    if (isUpdating) {
        loc = groupInfo.city + "," + groupInfo.state;
    }
    let gImage;
    if (groupInfo.groupImages) {
        // gImage = groupInfo.groupImages.filter((img) => img.preview === true)[0];
        gImage = groupInfo.groupImages[0];
    }
    const [location, setLocation] = useState(loc || "");
    const [groupName, setGroupName] = useState(groupInfo.name || "");
    const [description, setDescription] = useState(groupInfo.about || "");
    const [groupType, setGroupType] = useState(groupInfo.type || "");
    const [groupImage, setGroupImage] = useState(gImage || "");
    const [errors, setErrors] = useState({});
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [groupPrivacy, setGroupPrivacy] = useState("Public" || "");
    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
        let err = {};
        let loc = location.split(",");
        setHasSubmitted(true);

        if (groupName.length === 0) {
            err.name = "Name is required";
        }
        if (location.length === 0) {
            err.location = "Location is required";
        }

        if (!groupType) err.type = "Group Type is required";
        if (!groupPrivacy) err.privacy = "Visibility Type is required";
        if (
            !groupImage.endsWith(".png") &&
            !groupImage.endsWith(".jpg") &&
            !groupImage.endsWith(".jpeg")
        )
            err.image = "Image URL must end in .png, .jpg, or .jpeg";

        const payload = {
            name: groupName,
            about: description,
            type: groupType,
            private: groupPrivacy === "Private",
            city: loc[0],
            state: loc[1],
        };
        // const newGroup = await dispatch(createGroup(payload));
        const newGroup = await dispatch(createGroup(payload)).catch(
            async (res) => {
                setHasSubmitted(true);
                const data = await res.json();
                if (data && data.errors) setErrors({ ...data.errors, ...err });
            }
        );
        if (newGroup) {
            await createGroupImage(newGroup.id, groupImage, true);
            history.push(`/groups/${newGroup.id}`);
        }
    };

    return (
        <div>
            <h3>BECOME AN ORGANIZER</h3>
            <h2>
                We'll walk you through a few steps to build your local community
            </h2>
            <form onSubmit={handleSubmit}>
                <div className="form-create-section">
                    <h2>First, set your group's location</h2>
                    <p>
                        Meetup groups meet locally, in person and online. We'll
                        connect you with people in your area, and more can join
                        you online.
                    </p>
                    <input
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="City, STATE"
                        defaultValue={location}
                    ></input>
                    {hasSubmitted && errors.location && (
                        <p className="errors">*{errors.location}</p>
                    )}
                    {!errors.location && hasSubmitted && errors.state && (
                        <p className="errors">*{errors.state}</p>
                    )}
                </div>
                <div className="form-create-section">
                    <h2>What will your group's name be?</h2>
                    <p>
                        Choose a name that will give people a clear idea of what
                        the group is about. Feel free to get creative! You can
                        edit this later if you change your mind.
                    </p>
                    <input
                        defaultValue={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        placeholder="What is your group name?"
                    ></input>
                    {hasSubmitted && errors.name && (
                        <p className="errors">*{errors.name}</p>
                    )}
                </div>
                <div className="form-create-section">
                    <h2>Now describe what your group will be about</h2>
                    <p>
                        People will see this when we promote your group, but
                        you'll be able to add to it later, too
                    </p>
                    <ol>
                        <li>1. What's the purpose of the group?</li>
                        <li>2. Who should join?</li>
                        <li>3. What will you do at your events?</li>
                    </ol>
                    <textarea
                        defaultValue={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Please write at least 30 characters"
                    ></textarea>
                    {hasSubmitted && errors.about && (
                        <p className="errors">*{errors.about}</p>
                    )}
                </div>
                <div className="form-create-section">
                    <h2>Final steps...</h2>
                    <div>
                        <label htmlFor="type">
                            Is this an in person or online group?
                        </label>
                        <select
                            onChange={(e) => setGroupType(e.target.value)}
                            id="type"
                            name="type"
                            defaultValue={groupType}
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
                        <label htmlFor="type">
                            Is this group private or public?
                        </label>
                        <select
                            onChange={(e) => setGroupPrivacy(e.target.value)}
                            id="type"
                            name="type"
                            defaultValue={groupPrivacy}
                        >
                            <option value="">(select one)</option>
                            <option value="Public">Public</option>
                            <option value="Private">Private</option>
                        </select>
                        {hasSubmitted && errors.privacy && (
                            <p className="errors">*{errors.privacy}</p>
                        )}
                    </div>
                    <div>
                        <p>Please add an image url for your group below:</p>
                        <input
                            onChange={(e) => setGroupImage(e.target.value)}
                            defaultValue={groupImage}
                        ></input>
                        {hasSubmitted && errors.image && (
                            <p className="errors">*{errors.image}</p>
                        )}
                    </div>
                </div>
                {!isUpdating ? (
                    <button id="submit" type="submit">
                        Create group
                    </button>
                ) : (
                    <button id="submit" type="submit">
                        Update group
                    </button>
                )}
            </form>
        </div>
    );
}
