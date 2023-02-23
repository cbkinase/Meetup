const express = require("express");
const { setTokenCookie, restoreUser } = require("../../utils/auth");
const { User, Group, GroupImage, Membership } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { requireAuth } = require("../../utils/auth");
const { Op } = require("sequelize");

const router = express.Router();

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
        console.log(group.GroupImages[0]);
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

router.get("/current", requireAuth, async (req, res, next) => {
    let groups = await Group.findAll({
        where: {
            id: req.user.id,
        },
        include: { model: GroupImage },
    });

    const counts = [];
    for (const grp of groups) {
        const members = await grp.getMemberships();
        counts.push(members.length);
    }

    groups = groups.map((group, idx) => {
        group = group.toJSON();
        group.numMembers = counts[idx];
        console.log(group.GroupImages[0]);
        // Check to see whether the group has a preview image, set to null if not.
        group.previewImage = group.GroupImages[0]?.url
            ? group.GroupImages[0].url
            : null;
        delete group.GroupImages;
        return group;
    });
    res.json({ Groups: groups });
});

module.exports = router;
