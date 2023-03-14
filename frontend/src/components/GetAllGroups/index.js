import { useDispatch, useSelector } from "react-redux";
import { useHistory, NavLink } from "react-router-dom";
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
        <ul className="item1-container">
            {Object.values(groups.allGroups).map((group) => {
                return <AbridgedGroupInfo group={group}></AbridgedGroupInfo>;
            })}
        </ul>
    );
}
