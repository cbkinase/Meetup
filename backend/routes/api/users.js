const express = require("express");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

// Middleware to validate signup

const validateSignup = [
    check("email")
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage("Invalid email."),
    check("username")
        .exists({ checkFalsy: true })
        .isLength({ min: 4 })
        .withMessage("Please provide a username with at least 4 characters."),
    check("username")
        .not()
        .isEmail()
        .withMessage("Username cannot be an email."),
    check("password")
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage("Password must be 6 characters or more."),
    check("firstName")
        .exists({ checkFalsy: true })
        .withMessage("First Name is required"),
    check("lastName")
        .exists({ checkFalsy: true })
        .withMessage("Last Name is required"),
    handleValidationErrors,
];

const router = express.Router();

// Sign up
router.post("/", validateSignup, async (req, res, next) => {
    const { email, password, firstName, lastName, username } = req.body;
    const checkDuplicateUsername = await User.findOne({
        where: {
            username: username,
        },
    });
    const checkDuplicateEmail = await User.findOne({
        where: {
            email: email,
        },
    });

    if (checkDuplicateEmail || checkDuplicateUsername) {
        const err = new Error("Error: User Already Exists");
        err.errors = {};
        err.status = 403;
        if (checkDuplicateEmail)
            err.errors.email = "User with that email already exists";
        if (checkDuplicateUsername)
            err.errors.username = "User with that username already exists";
        throw err;
    }

    let user;
    try {
        user = await User.signup({
            email,
            password,
            firstName,
            lastName,
            username,
        });
    } catch (err) {
        err.status = 403;
        next(err);
    }

    const tok = await setTokenCookie(res, user);
    user = user.toJSON();
    user.token = tok;

    return res.json({
        user: user,
    });
});

module.exports = router;
