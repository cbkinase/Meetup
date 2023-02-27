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

// Delete an Image for an Event

router.delete("/:imageId", requireAuth, async (req, res, next) => {
    let eventImage = await EventImage.findByPk(req.params.imageId);

    if (!eventImage) {
        let err = new Error("Event Image couldn't be found");
        err.status = 404;
        return next(err);
    }

    let event = await eventImage.getEvent();
    let group = await event.getGroup();
    let membership = await group.getMemberships({
        where: {
            groupId: group.id,
            userId: req.user.id,
            status: "co-host",
        },
    });
    if (!membership.length) {
        let err = new Error("Forbidden");
        err.status = 403;
        return next(err);
    }
    await eventImage.destroy();
    return res.json({
        message: "Successfully deleted",
        statusCode: 200,
    });
});

module.exports = router;
