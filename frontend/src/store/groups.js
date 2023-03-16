import { csrfFetch } from "./csrf";
import normalizeData from "./normalize";

const GET_ALL_GROUPS = "groups/getAllGroups";
const MAKE_GROUP = "groups/makeGroup";
const GET_SINGLE_GROUP = "groups/info";
const MAKE_GROUP_IMAGE = "/groups/makeImage";
const DELETE_GROUP = "/groups/delete";

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

function makeGroupImage(groupId, img) {
    return {
        type: MAKE_GROUP_IMAGE,
        groupId,
        img,
    };
}

function deleteGroup(id) {
    return {
        type: DELETE_GROUP,
        id,
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

export function editGroup(group, groupId) {
    return async function (dispatch) {
        const res = await csrfFetch(`/api/groups/${groupId}`, {
            method: "PUT",
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

export function createGroupImage(groupId, url, preview = false) {
    return async function (dispatch) {
        const res = await csrfFetch(`/api/groups/${groupId}/images`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                url,
                preview,
            }),
        });

        if (res.ok) {
            const data = await res.json();
            dispatch(makeGroupImage(groupId, data));
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

export function destroyGroup(id) {
    return async function (dispatch) {
        const res = await csrfFetch(`/api/groups/${id}`, {
            method: "DELETE",
        });

        if (res.ok) {
            dispatch(deleteGroup(id));
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
        case MAKE_GROUP_IMAGE: {
            return {
                ...state,
                singleGroup: {
                    ...state.singleGroup,
                    GroupImages: [...state.singleGroup.GroupImages, action.img],
                },
            };
        }
        case GET_SINGLE_GROUP: {
            return { ...state, singleGroup: { ...action.group } };
        }
        case DELETE_GROUP: {
            let newState = {
                ...state,
                singleGroup: {},
                allGroups: { ...state.allGroups },
            };
            delete newState.allGroups[action.id];
            return newState;
        }
        default:
            return state;
    }
}
