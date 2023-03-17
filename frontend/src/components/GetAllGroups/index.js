import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { useEffect } from "react";
import { getAllGroups } from "../../store/groups";
import { getAllEvents } from "../../store/events";
import AbridgedGroupInfo from "../AbridgedGroupInfo";
import AbridgedEventInfo from "../AbridgedEventInfo";
import "./GetAllGroups.css";

export default function GroupCollection({ isEvents }) {
    const dispatch = useDispatch();

    const groups = useSelector((state) => state.groups);
    const events = useSelector((state) => state.events);

    useEffect(() => {
        dispatch(getAllGroups());
        dispatch(getAllEvents());
    }, [dispatch]);

    if (!isEvents) {
        if (Object.values(groups.allGroups).length === 0) return null;
    } else if (Object.values(events.allEvents).length === 0) return null;

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
                {!isEvents
                    ? Object.values(groups.allGroups).map((group) => {
                          return (
                              <AbridgedGroupInfo
                                  key={group.id}
                                  group={group}
                                  numEvents={
                                      Object.values(events.allEvents).filter(
                                          (event) => event.groupId === group.id
                                      ).length
                                  }
                              ></AbridgedGroupInfo>
                          );
                      })
                    : Object.values(events.allEvents).map((event) => {
                          return (
                              <AbridgedEventInfo
                                  key={event.id}
                                  event={event}
                              ></AbridgedEventInfo>
                          );
                      })}
            </ul>
        </div>
    );
}
