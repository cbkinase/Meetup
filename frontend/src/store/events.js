import { csrfFetch } from "./csrf";
import normalizeData from "./normalize";

const GET_ALL_EVENTS = "events/getAllEvents";

function loadEvents(events) {
    return {
        type: GET_ALL_EVENTS,
        events,
    };
}

export function getAllEvents() {
    return async function (dispatch) {
        const res = await fetch("/api/events");

        if (res.ok) {
            const data = await res.json();
            const normalizedData = normalizeData(data.Events);
            dispatch(loadEvents(normalizedData));
            return normalizedData;
        }
    };
}

const initialState = { allEvents: {}, singleEvent: {} };

export default function eventReducer(state = initialState, action) {
    switch (action.type) {
        case GET_ALL_EVENTS: {
            return { ...state, allEvents: { ...action.events } };
        }
        default:
            return state;
    }
}
