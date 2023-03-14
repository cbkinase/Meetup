import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { useEffect } from "react";
import { getAllGroups } from "../../store/groups";
import AbridgedGroupInfo from "../AbridgedGroupInfo";
import "./GetAllGroups.css";

export default function GroupCollection() {
    const dispatch = useDispatch();

    const groups = useSelector((state) => state.groups);

    useEffect(() => {
        dispatch(getAllGroups());
    }, [dispatch]);

    if (Object.values(groups.allGroups).length === 0) return null;

    return (
        <div>
            <div id="top-bar-groups-events">
                <div>
                    <NavLink className="active-tab" to="/groups">
                        Groups
                    </NavLink>
                    <NavLink className="inactive-tab" to="/events">
                        Events
                    </NavLink>
                </div>
                <h2>Groups in Meetup</h2>
            </div>
            <ul className="item1-container">
                {Object.values(groups.allGroups).map((group) => {
                    return (
                        <AbridgedGroupInfo group={group}></AbridgedGroupInfo>
                    );
                })}
            </ul>
        </div>
    );
}
