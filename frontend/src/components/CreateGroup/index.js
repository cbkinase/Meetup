import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { createGroup } from "../../store/groups";
import { useHistory } from "react-router-dom";

export default function CreateGroupForm() {
    const dispatch = useDispatch();
    const [location, setLocation] = useState("");
    const [groupName, setGroupName] = useState("");
    const [description, setDescription] = useState("");
    const [groupType, setGroupType] = useState("");
    const [groupImage, setGroupImage] = useState("");
    const [errors, setErrors] = useState({});
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [groupPrivacy, setGroupPrivacy] = useState("");
    const history = useHistory();

    useEffect(() => {}, [
        location,
        groupName,
        description,
        groupType,
        groupImage,
        groupPrivacy,
    ]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        let err = {};
        let loc = location.split(",");

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
        if (newGroup) history.push(`/groups/${newGroup.id}`);
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
                    ></input>
                </div>
                <div className="form-create-section">
                    <h2>What will your group's name be?</h2>
                    <p>
                        Choose a name that will give people a clear idea of what
                        the group is about. Feel free to get creative! You can
                        edit this later if you change your mind.
                    </p>
                    <input
                        onChange={(e) => setGroupName(e.target.value)}
                        placeholder="What is your group name?"
                    ></input>
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
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Please write at least 30 characters"
                    ></textarea>
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
                        >
                            <option value="">(select one)</option>
                            <option value="Online">Online</option>
                            <option value="In person">In person</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="type">
                            Is this group private or public?
                        </label>
                        <select
                            onChange={(e) => setGroupPrivacy(e.target.value)}
                            id="type"
                            name="type"
                        >
                            <option value="">(select one)</option>
                            <option value="Public">Public</option>
                            <option value="Private">Private</option>
                        </select>
                    </div>
                    <div>
                        <p>Please add an image url for your group below:</p>
                        <input
                            onChange={(e) => setGroupImage(e.target.value)}
                        ></input>
                    </div>
                </div>
                <button id="submit" type="submit">
                    Create group
                </button>
            </form>
        </div>
    );
}
