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
const { validateEventCreation } = require("./groups");
const group = require("../../db/models/group");

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

// Edit an Event specified by its id

router.put(
    "/:eventId",
    [requireAuth, ensureEventExists, validateEventCreation],
    async (req, res, next) => {
        let event = await Event.findByPk(req.params.eventId);
        await event.update({
            venueId: req.body.venueId,
            name: req.body.name,
            type: req.body.type,
            capacity: req.body.capacity,
            price: req.body.price,
            description: req.body.description,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
        });
        event = event.toJSON();
        delete event.updatedAt;
        return res.json(event);
    }
);

// Delete an Event specified by its id

router.delete(
    "/:eventId",
    [requireAuth, ensureEventExists],
    async (req, res, next) => {
        let event = await Event.findByPk(req.params.eventId);
        let group = await event.getGroup();
        let memberships = await group.getMemberships({
            where: {
                userId: req.user.id,
            },
        });
        if (!memberships) {
            let err = new Error("Forbidden");
            err.status = 403;
            return next(err);
        }
        await event.destroy();
        return res.json({
            message: "Successfully deleted",
        });
    }
);

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

// Get all Attendees of an Event specified by its id

router.get("/:eventId/attendees", ensureEventExists, async (req, res, next) => {
    let event = await Event.findByPk(req.params.eventId);
    let query = {
        where: { status: { [Op.not]: ["pending"] } },
        attributes: ["status"],
        include: { model: User },
    };
    // Check to see if user is co-host/owner of
    // the Group the Event belongs to
    if (req.user) {
        let group = await event.getGroup();
        let membership = await group.getMemberships({
            where: {
                userId: req.user.id,
                groupId: group.id,
            },
        });
        if (membership[0].status === "co-host") {
            delete query.where;
        }
    }

    let attendees = await event.getAttendances(query);
    attendees = attendees.map((attendee) => {
        attendee = attendee.toJSON();
        attendee.id = attendee.User.id;
        attendee.firstName = attendee.User.firstName;
        attendee.lastName = attendee.User.lastName;
        attendee.Attendance = { status: attendee.status };
        delete attendee.status;
        delete attendee.User;
        return attendee;
    });
    return res.json({ Attendees: attendees });
});

// Request to Attend an Event based on the Event's id

router.post(
    "/:eventId/attendance",
    [requireAuth, ensureEventExists],
    async (req, res, next) => {
        let event = await Event.findByPk(req.params.eventId);
        let group = await event.getGroup();
        // Make sure User is Member of Group
        let membership = await group.getMemberships({
            where: {
                userId: req.user.id,
                groupId: group.id,
                status: { [Op.in]: ["member", "co-host"] },
            },
        });
        if (!membership.length) {
            let err = new Error("Forbidden");
            err.status = 403;
            return next(err);
        }
        // Check to see if User is already attending
        let possibleAttendance = await event.getAttendances({
            where: { userId: req.user.id },
        });
        if (possibleAttendance.length) {
            let attendanceStatus = possibleAttendance[0].status;
            if (attendanceStatus === "pending") {
                let err = new Error("Attendance has already been requested");
                err.status = 400;
                return next(err);
            }
            if (
                attendanceStatus === "attending" ||
                attendanceStatus === "waitlist"
            ) {
                let err = new Error("User is already an attendee of the event");
                err.status = 400;
                return next(err);
            }
        }

        let attendanceRequest = await Attendance.create({
            eventId: req.params.eventId,
            userId: req.user.id,
            status: "pending",
        });

        return res.json({
            userId: req.user.id,
            status: attendanceRequest.status,
        });
    }
);

module.exports = router;
