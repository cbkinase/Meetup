const express = require("express");
const { setTokenCookie, restoreUser } = require("../../utils/auth");
const { User, Group, GroupImage, Membership } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

router.get("/", async (req, res, next) => {
    let groups = await Group.findAll({
        include: {
            model: GroupImage,
            where: { preview: true },
            attributes: ["url"],
        },
    });
    const counts = [];
    for (const grp of groups) {
        const members = await grp.getMemberships();
        counts.push(members.length);
    }
    groups = groups.map((group) => group.toJSON());
    groups = groups.map((group, idx) => {
        group.numMembers = counts[idx];
        group.previewImage = group.GroupImages[0].url;
        delete group.GroupImages;
        return group;
    });
    return res.json({
        Groups: groups,
    });
});

module.exports = router;
