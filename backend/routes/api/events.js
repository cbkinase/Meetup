const express = require("express");
const { setTokenCookie, restoreUser } = require("../../utils/auth");
const {
    User,
    Group,
    GroupImage,
    Membership,
    Venue,
    Event,
    EventImage,
    Attendance,
} = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { requireAuth } = require("../../utils/auth");
const { Op } = require("sequelize");
const { route } = require("./users");

const router = express.Router();

// Get all Events

router.get("/", async (req, res, next) => {
    let events = await Event.findAll({
        attributes: {
            exclude: ["capacity", "price", "updatedAt", "createdAt"],
        },
        include: [
            { model: EventImage },
            {
                model: Venue,
                attributes: {
                    exclude: [
                        "createdAt",
                        "updatedAt",
                        "lat",
                        "lng",
                        "groupId",
                        "address",
                    ],
                },
            },
            {
                model: Group,
                attributes: {
                    exclude: [
                        "organizerId",
                        "private",
                        "type",
                        "createdAt",
                        "updatedAt",
                    ],
                },
            },
        ],
    });
    const counts = [];
    for (const event of events) {
        const attendees = await event.getAttendances();
        counts.push(attendees.length);
    }

    events = events.map((event, idx) => {
        event = event.toJSON();
        event.numAttending = counts[idx];
        event.previewImage = event.EventImages[0]?.url
            ? event.EventImages[0].url
            : null;
        delete event.EventImages;
        return event;
    });

    return res.json({
        Events: events,
    });
});

module.exports = router;
