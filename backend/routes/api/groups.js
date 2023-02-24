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
    console.log(groups);
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

// Add an Image to a Group based on the Group's id

router.post("/:id/images", requireAuth, async (req, res, next) => {
    let group = await Group.findByPk(req.params.id);
    if (!group) {
        let err = new Error("Group couldn't be found");
        err.status = 404;
        return next(err);
    }

    if (req.user.id !== group.organizerId) {
        let err = new Error("Forbidden");
        err.status = 403;
        return next(err);
    }

    let img = await group.createGroupImage({
        url: req.body.url,
        preview: req.body.preview,
    });
    return res.json({
        id: img.id,
        url: img.url,
        preview: img.preview,
    });
});

// Delete a Group

router.delete("/:id", requireAuth, async (req, res, next) => {
    let group = await Group.findByPk(req.params.id);
    if (!group) {
        let err = new Error("Group couldn't be found");
        err.status = 404;
        return next(err);
    }

    if (req.user.id !== group.organizerId) {
        let err = new Error("Forbidden");
        err.status = 403;
        return next(err);
    }

    await group.destroy();
    return res.json({
        message: "Successfully deleted",
        statusCode: 200,
    });
});

// Edit a Group

router.put("/:id", groupCreationMiddleware, async (req, res, next) => {
    let group = await Group.findByPk(req.params.id);
    if (!group) {
        let err = new Error("Group couldn't be found");
        err.status = 404;
        return next(err);
    }

    if (req.user.id !== group.organizerId) {
        let err = new Error("Forbidden");
        err.status = 403;
        return next(err);
    }

    await group.update({
        name: req.body.name,
        about: req.body.about,
        type: req.body.type,
        private: req.body.private,
        city: req.body.city,
        state: req.body.state,
    });
    return res.json(group);
});

// Get details of a Group from an id

router.get("/:id", async (req, res, next) => {
    let group = await Group.findByPk(req.params.id, {
        include: { all: true },
    });
    if (!group) {
        let err = new Error("Group couldn't be found");
        err.status = 404;
        return next(err);
    }

    numMembers = await group.getMemberships();
    group = group.toJSON();
    group.numMembers = numMembers.length;
    delete group.Memberships;
    group.Organizer = group.User;
    delete group.User;
    delete group.Organizer.username;
    return res.json(group);
});

module.exports = router;
