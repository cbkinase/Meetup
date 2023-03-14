import normalizeData from "./normalize";

const GET_ALL_GROUPS = "groups/getAllGroups";

function loadGroups(groups) {
    return {
        type: GET_ALL_GROUPS,
        groups,
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

const initialState = { allGroups: {}, singleGroup: {}, Venues: {} };

export default function groupsReducer(state = initialState, action) {
    switch (action.type) {
        case GET_ALL_GROUPS: {
            return { ...state, allGroups: { ...action.groups } };
        }
        default:
            return state;
    }
}
