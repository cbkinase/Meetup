const express = require("express");
const { setTokenCookie, restoreUser } = require("../../utils/auth");
const {
    User,
    Group,
    GroupImage,
    Membership,
    Venue,
} = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { requireAuth } = require("../../utils/auth");
const { Op } = require("sequelize");
const { route } = require("./users");

async function ensureUserIsCoHost(req, res, next) {
    let group = await Group.findOne({
        include: [
            {
                model: Membership,
                where: {
                    userId: req.user.id,
                    status: "co-host",
                },
            },
            {
                model: Venue,
                where: {
                    id: req.params.id,
                },
            },
        ],
    });
    if (!group) {
        let err = new Error("Forbidden");
        err.status = 403;
        return next(err);
    }
    next();
}

async function ensureVenueExists(req, res, next) {
    let venue = await Venue.findByPk(req.params.id);

    if (!venue) {
        let err = new Error("Venue couldn't be found");
        err.status = 404;
        return next(err);
    }
    next();
}

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
    ensureUserIsCoHost,
    ensureVenueExists,
    ...validateVenueCreation,
];

const router = express.Router();

router.put("/:id", venueCreationMiddleware, async (req, res, next) => {
    let venue = await Venue.findByPk(req.params.id);

    await venue.update({
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        lat: req.body.lat,
        lng: req.body.lng,
    });

    return res.json({
        id: venue.id,
        groupId: venue.groupId,
        address: venue.address,
        city: venue.city,
        state: venue.state,
        lat: venue.lat,
        lng: venue.lng,
    });
});

router.delete("/:id", [requireAuth, ensureVenueExists, ensureUserIsCoHost], async (req, res, next) => {
    let venue = await Venue.findByPk(req.params.id);

    await venue.destroy();

    return res.json({
        message: "Successfully deleted",
        statusCode: 200,
    });
})

module.exports = router;
