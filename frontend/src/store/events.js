import { csrfFetch } from "./csrf";
import normalizeData from "./normalize";

const GET_ALL_EVENTS = "events/getAllEvents";
const GET_SINGLE_EVENT = "events/info";
const DELETE_EVENT = "events/delete";
const MAKE_EVENT = "events/makeEvent";
const MAKE_EVENT_IMAGE = "events/makeImage";

function loadEvents(events) {
    return {
        type: GET_ALL_EVENTS,
        events,
    };
}

function loadEventInfo(event) {
    return {
        type: GET_SINGLE_EVENT,
        event,
    };
}

function deleteEvent(id) {
    return {
        type: DELETE_EVENT,
        id,
    };
}

function makeEvent(event) {
    return {
        type: MAKE_EVENT,
        event,
    };
}

function makeEventImage(eventId, img) {
    return {
        type: MAKE_EVENT_IMAGE,
        eventId,
        img,
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

export function getEventInfo(eventId) {
    return async function (dispatch) {
        const res = await fetch(`/api/events/${eventId}`);

        if (res.ok) {
            const data = await res.json();
            dispatch(loadEventInfo(data));
            return data;
        }
    };
}

export function destroyEvent(id) {
    return async function (dispatch) {
        const res = await csrfFetch(`/api/events/${id}`, {
            method: "DELETE",
        });

        if (res.ok) {
            dispatch(deleteEvent(id));
        }
    };
}

export function createEvent(event, groupId) {
    return async function (dispatch) {
        const res = await csrfFetch(`/api/groups/${groupId}/events`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(event),
        });

        if (res.ok) {
            const data = await res.json();
            dispatch(makeEvent(event));
            return data;
        }
    };
}

export function editEvent(payload, eventId) {
    return async function (dispatch) {
        const res = await csrfFetch(`/api/events/${eventId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        })

        if (res.ok) {
            const data = await res.json();
            dispatch(makeEvent(payload));
            return data;
        }
    }
}

export function createEventImage(eventId, url, preview = false) {
    return async function (dispatch) {
        const res = await csrfFetch(`/api/events/${eventId}/images`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                url,
                preview,
            }),
        });

        if (res.ok) {
            const data = await res.json();
            dispatch(makeEventImage(eventId, data));
            return data;
        }
    };
}

const initialState = { allEvents: {}, singleEvent: {} };

export default function eventReducer(state = initialState, action) {
    switch (action.type) {
        case GET_ALL_EVENTS: {
            return { ...state, allEvents: { ...action.events } };
        }
        case GET_SINGLE_EVENT: {
            return { ...state, singleEvent: { ...action.event } };
        }
        case DELETE_EVENT: {
            let newState = {
                ...state,
                singleEvent: {},
                allEvents: { ...state.allEvents },
            };
            delete newState.allEvents[action.id];
            return newState;
        }
        case MAKE_EVENT: {
            return {
                ...state,
                allEvents: {
                    ...state.allEvents,
                    [action.event.id]: action.event,
                },
            };
        }
        case MAKE_EVENT_IMAGE: {
            return {
                ...state,
                singleEvent: {
                    ...state.singleEvent,
                    EventImages: [action.img],
                },
            };
        }
        default:
            return state;
    }
}
