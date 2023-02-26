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

// Some middleware

async function ensureGroupExists(req, res, next) {
    if (!req.params.groupId) {
        req.params.groupId = req.params.id;
    }
    let group = await Group.findByPk(req.params.groupId);

    if (!group) {
        let err = new Error("Group couldn't be found");
        err.status = 404;
        return next(err);
    }
    next();
}

async function ensureUserIsOrganizer(req, res, next) {
    if (!req.params.groupId) {
        req.params.groupId = req.params.id;
    }
    let group = await Group.findByPk(req.params.groupId);

    if (req.user.id !== group.organizerId) {
        let err = new Error("Forbidden");
        err.status = 403;
        return next(err);
    }
    next();
}

async function ensureUserIsCoHost(req, res, next) {
    if (!req.params.groupId) {
        req.params.groupId = req.params.id;
    }
    let group = await Group.findByPk(req.params.groupId, {
        include: {
            model: Membership,
            where: {
                userId: req.user.id,
                status: "co-host",
            },
        },
    });
    if (!group) {
        let err = new Error("Forbidden");
        err.status = 403;
        return next(err);
    }
    next();
}

// Group creation middleware

const validateGroupCreation = [
    check("name")
        .exists({ checkFalsy: true })
        .isLength({ max: 60 })
        .withMessage("Name must be 60 characters or less"),
    check("about")
        .exists({ checkFalsy: true })
        .isLength({ min: 50 })
        .withMessage("About must be 50 characters or more"),
    check("type")
        .exists({ checkFalsy: true })
        .isIn(["Online", "In person"])
        .withMessage("Type must be 'Online' or 'In person'"),
    check("private")
        .exists()
        .isBoolean()
        .withMessage("Private must be boolean"),
    check("city").exists().withMessage("City is required"),
    check("state").exists().withMessage("State is required"),
    handleValidationErrors,
];
const groupCreationMiddleware = [requireAuth, ...validateGroupCreation];

// Venue creation middleware

const validateVenueCreation = [
    check("address")
        .exists({ checkFalsy: true })
        .withMessage("Street address is required"),
    check("city").exists().withMessage("City is required"),
    check("state").exists().withMessage("State is required"),
    check("lat")
        .exists()
        .isFloat({ min: -180, max: 180 })
        .withMessage("Latitude is not valid"),
    check("lng")
        .exists()
        .isFloat({ min: -180, max: 180 })
        .withMessage("Longitude is not valid"),
    handleValidationErrors,
];

const venueCreationMiddleware = [
    requireAuth,
    ensureGroupExists,
    ensureUserIsCoHost,
    ...validateVenueCreation,
];

// Event creation middleware

const validateEventCreation = [
    check("venueId").custom(async (venueId) => {
        let venue = await Venue.findByPk(venueId);
        if (!venue) {
            let err = new Error("Venue does not exist");
            err.status = 400;
            throw err;
        } else {
        }
        return true;
    }),
    check("name")
        .exists()
        .isLength({ min: 5 })
        .withMessage("Name must be at least 5 characters"),
    check("type")
        .exists()
        .isIn(["Online", "In person"])
        .withMessage("Type must be Online or In person"),
    check("capacity")
        .exists()
        .isInt()
        .withMessage("Capacity must be an integer"),
    check("price").exists().isFloat({ min: 0 }).withMessage("Price is invalid"),
    check("description")
        .exists({ checkFalsy: true })
        .withMessage("Description is required"),
    check("startDate")
        .exists()
        .custom((date) => {
            let now = new Date();
            let comparisonDate = new Date(date);
            if (comparisonDate == "Invalid Date" || now > comparisonDate) {
                let err = new Error("Start date must be in the future");
                err.status = 400;
                throw err;
            } else {
                return true;
            }
        }),
    check("endDate")
        .exists()
        .custom((date, { req }) => {
            let startDate = new Date(req.body.startDate);
            let endDate = new Date(date);
            if (endDate == "Invalid Date" || endDate < startDate) {
                let err = new Error("End date is less than start date");
                err.status = 400;
                throw err;
            } else {
                return true;
            }
        }),
    handleValidationErrors,
];

const eventCreationMiddleware = [
    requireAuth,
    ensureGroupExists,
    ensureUserIsCoHost,
    ...validateEventCreation,
];

const router = express.Router();

// Get all Groups

router.get("/", async (req, res, next) => {
    let groups = await Group.findAll({
        include: {
            model: GroupImage,
            // where: {
            //     url: {
            //         [Op.not]: false,
            //     },
            // },
            // attributes: ["url"],
        },
    });
    const counts = [];
    for (const grp of groups) {
        const members = await grp.getMemberships();
        counts.push(members.length);
    }

    groups = groups.map((group, idx) => {
        group = group.toJSON();
        group.numMembers = counts[idx];
        // Check to see whether the group has a preview image, set to null if not.
        group.previewImage = group.GroupImages[0]?.url
            ? group.GroupImages[0].url
            : null;
        delete group.GroupImages;
        return group;
    });
    return res.json({
        Groups: groups,
    });
});

// Get all Groups joined or organized by the Current User

router.get("/current", requireAuth, async (req, res, next) => {
    let groups = await Group.findAll({
        // where: {
        //     id: req.user.id,
        // },
        include: [
            { model: GroupImage },
            {
                model: Membership,
                where: { userId: req.user.id },
                attributes: [],
            },
        ],
    });
    const counts = [];
    for (const grp of groups) {
        const members = await grp.getMemberships();
        counts.push(members.length);
    }

    groups = groups.map((group, idx) => {
        group = group.toJSON();
        group.numMembers = counts[idx];
        // Check to see whether the group has a preview image, set to null if not.
        group.previewImage = group.GroupImages[0]?.url
            ? group.GroupImages[0].url
            : null;
        delete group.GroupImages;
        return group;
    });
    return res.json({ Groups: groups });
});

// Create a Group

router.post("/", groupCreationMiddleware, async (req, res, next) => {
    const { name, about, type, private, city, state } = req.body;
    let group = await Group.create({
        organizerId: req.user.id,
        name: name,
        about: about,
        type: type,
        private: private,
        city: city,
        state: state,
    });
    await Membership.create({
        userId: req.user.id,
        groupId: group.id,
        status: "co-host",
    });
    res.status(201);
    return res.json(group);
});

// Get All Venues for a Group specified by its id

router.get(
    "/:groupId/venues",
    [requireAuth, ensureGroupExists, ensureUserIsOrganizer],
    async (req, res, next) => {
        let venues = await Venue.findAll({
            include: {
                model: Group,
                where: {
                    id: req.params.groupId,
                },
                attributes: [],
            },
            attributes: [
                "id",
                "groupId",
                "address",
                "city",
                "state",
                "lat",
                "lng",
            ],
        });

        return res.json({
            Venues: venues,
        });
    }
);

// Get all Events of a Group specified by its id

router.get("/:groupId/events", async (req, res, next) => {
    let events = await Event.findAll({
        where: {
            groupId: req.params.groupId,
        },
        attributes: {
            exclude: [
                "capacity",
                "price",
                "updatedAt",
                "createdAt",
                "description",
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

// Create an Event for a Group specified by its id

router.post(
    "/:groupId/events",
    eventCreationMiddleware,
    async (req, res, next) => {
        const {
            venueId,
            name,
            type,
            capacity,
            price,
            description,
            startDate,
            endDate,
        } = req.body;
        const groupId = req.params.groupId;

        let group = await Group.findByPk(groupId);
        let event = await group.createEvent({
            venueId: venueId,
            groupId: groupId,
            name: name,
            type: type,
            capacity: capacity,
            price: price,
            description: description,
            startDate: startDate,
            endDate: endDate,
        });
        event = event.toJSON();
        delete event.createdAt;
        delete event.updatedAt;

        return res.json(event);
    }
);

// Create a new Venue for a Group specified by its id

router.post(
    "/:groupId/venues",
    venueCreationMiddleware,
    async (req, res, next) => {
        let group = await Group.findByPk(req.params.groupId);

        const { id, groupId, address, city, state, lat, lng } = req.body;

        let venue = await group.createVenue({
            id: id,
            groupId: groupId,
            address: address,
            city: city,
            state: state,
            lat: lat,
            lng: lng,
        });

        return res.json(venue);
    }
);

// Add an Image to a Group based on the Group's id

router.post(
    "/:id/images",
    [requireAuth, ensureGroupExists, ensureUserIsOrganizer],
    async (req, res, next) => {
        let group = await Group.findByPk(req.params.id);

        let img = await group.createGroupImage({
            url: req.body.url,
            preview: req.body.preview,
        });
        return res.json({
            id: img.id,
            url: img.url,
            preview: img.preview,
        });
    }
);

// Delete a Group

router.delete(
    "/:id",
    [requireAuth, ensureGroupExists, ensureUserIsOrganizer],
    async (req, res, next) => {
        let group = await Group.findByPk(req.params.id);

        await group.destroy();
        return res.json({
            message: "Successfully deleted",
            statusCode: 200,
        });
    }
);

// Edit a Group

router.put(
    "/:id",
    [ensureGroupExists, groupCreationMiddleware, ensureUserIsOrganizer],
    async (req, res, next) => {
        let group = await Group.findByPk(req.params.id);

        await group.update({
            name: req.body.name,
            about: req.body.about,
            type: req.body.type,
            private: req.body.private,
            city: req.body.city,
            state: req.body.state,
        });
        return res.json(group);
    }
);

// Get details of a Group from an id

router.get("/:id", ensureGroupExists, async (req, res, next) => {
    let group = await Group.findByPk(req.params.id, {
        include: { all: true },
    });

    numMembers = await group.getMemberships();
    group = group.toJSON();
    group.numMembers = numMembers.length;
    delete group.Memberships;
    group.Organizer = group.User;
    delete group.User;
    delete group.Organizer.username;
    return res.json(group);
});

module.exports = { router, validateEventCreation };
