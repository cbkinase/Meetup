import { csrfFetch } from "./csrf";
import normalizeData from "./normalize";

const GET_ALL_GROUPS = "groups/getAllGroups";
const MAKE_GROUP = "groups/makeGroup";
const GET_SINGLE_GROUP = "groups/info";

function loadGroups(groups) {
    return {
        type: GET_ALL_GROUPS,
        groups,
    };
}

function makeGroup(group) {
    return {
        type: MAKE_GROUP,
        group,
    };
}

function loadGroupInfo(group) {
    return {
        type: GET_SINGLE_GROUP,
        group,
    };
}

export function getAllGroups() {
    return async function (dispatch) {
        const res = await fetch("/api/groups");

        if (res.ok) {
            const data = await res.json();
            const normalizedData = normalizeData(data.Groups);
            dispatch(loadGroups(normalizedData));
            return normalizedData;
        }
    };
}

export function createGroup(group) {
    return async function (dispatch) {
        const res = await csrfFetch("/api/groups", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(group),
        });

        if (res.ok) {
            const data = await res.json();
            dispatch(makeGroup(data));
            return data;
        }
    };
}

export function getGroupInfo(id) {
    return async function (dispatch) {
        const res = await fetch(`/api/groups/${id}`);

        if (res.ok) {
            const data = await res.json();
            dispatch(loadGroupInfo(data));
            return data;
        }
    };
}

const initialState = { allGroups: {}, singleGroup: {}, Venues: {} };

export default function groupsReducer(state = initialState, action) {
    switch (action.type) {
        case GET_ALL_GROUPS: {
            return { ...state, allGroups: { ...action.groups } };
        }
        case MAKE_GROUP: {
            return {
                ...state,
                allGroups: {
                    ...state.allGroups,
                    [action.group.id]: action.group,
                },
            };
        }
        case GET_SINGLE_GROUP: {
            return { ...state, singleGroup: { ...action.group } };
        }
        default:
            return state;
    }
}
