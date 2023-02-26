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

async function ensureEventExists(req, res, next) {
    const event = await Event.findByPk(req.params.eventId);

    if (!event) {
        let err = new Error("Event couldn't be found");
        err.status = 404;
        return next(err);
    }
    next();
}

const router = express.Router();

// Get all Events

router.get("/", async (req, res, next) => {
    let events = await Event.findAll({
        attributes: {
            exclude: [
                "capacity",
                "description",
                "price",
                "updatedAt",
                "createdAt",
            ],
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
                        "about",
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

// Get details of an Event specified by its id

router.get("/:eventId", ensureEventExists, async (req, res, next) => {
    let event = await Event.findByPk(req.params.eventId, {
        attributes: {
            exclude: ["createdAt", "updatedAt"],
        },
        include: [
            {
                model: Group,
                attributes: ["id", "name", "private", "city", "state"],
            },
            {
                model: Venue,
                attributes: {
                    exclude: ["groupId", "createdAt", "updatedAt"],
                },
            },
            { model: EventImage, attributes: ["id", "url", "preview"] },
        ],
    });
    let attendees = await event.getAttendances();
    event = event.toJSON();
    event.numAttending = attendees.length;
    return res.json(event);
});

// Add an Image to a Event based on the Event's id

router.post(
    "/:eventId/images",
    [requireAuth, ensureEventExists],
    async (req, res, next) => {
        let event = await Event.findByPk(req.params.eventId, {
            include: [
                {
                    model: Attendance,
                    where: { userId: req.user.id, status: "attending" },
                },
            ],
        });
        if (!event) {
            let err = new Error("Forbidden");
            err.status = 403;
            return next(err);
        }
        let newImage = await event.createEventImage({
            url: req.body.url,
            preview: req.body.preview,
        });
        return res.json({
            id: newImage.id,
            url: newImage.url,
            preview: newImage.preview,
        });
    }
);

module.exports = router;
