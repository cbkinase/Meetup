"use strict";
const { Model, Validator } = require("sequelize");
const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        toSafeObject() {
            const { id, firstName, lastName, username, email } = this; // context will be the User instance
            return { id, firstName, lastName, username, email };
        }

        validatePassword(password) {
            return bcrypt.compareSync(password, this.hashedPassword.toString());
        }

        static getCurrentUserById(id) {
            return User.scope("currentUser").findByPk(id);
        }

        static async login({ credential, password }) {
            const { Op } = require("sequelize");
            const user = await User.scope("loginUser").findOne({
                where: {
                    [Op.or]: {
                        username: credential,
                        email: credential,
                    },
                },
            });
            if (user && user.validatePassword(password)) {
                return await User.scope("currentUser").findByPk(user.id);
            }
        }

        static async signup({
            username,
            email,
            password,
            firstName,
            lastName,
        }) {
            const hashedPassword = bcrypt.hashSync(password);
            const user = await User.create({
                username,
                email,
                hashedPassword,
                firstName,
                lastName,
            });
            return await User.scope("currentUser").findByPk(user.id);
        }

        static associate(models) {
            // define association here
            User.hasMany(models.Attendance, { foreignKey: "userId" });
            User.hasMany(models.Group, { foreignKey: "organizerId" });
            User.belongsToMany(models.Group, {
                through: "Membership",
                foreignKey: "userId",
                otherKey: "groupId",
            });
        }
    }

    User.init(
        {
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: [4, 30],
                    isNotEmail(value) {
                        if (Validator.isEmail(value)) {
                            throw new Error("Cannot be an email.");
                        }
                    },
                },
                unique: {
                    args: true,
                    msg: "User with that username already exists",
                },
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: [3, 256],
                    isEmail: true,
                },
                unique: {
                    args: true,
                    msg: "User with that email already exists",
                },
            },
            hashedPassword: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: [60, 60],
                },
            },
            firstName: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: [1, 50],
                },
            },
            lastName: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: [1, 50],
                },
            },
        },
        {
            sequelize,
            modelName: "User",
            defaultScope: {
                attributes: {
                    exclude: [
                        "hashedPassword",
                        "email",
                        "createdAt",
                        "updatedAt",
                    ],
                },
            },
            scopes: {
                currentUser: {
                    attributes: {
                        exclude: ["hashedPassword", "createdAt", "updatedAt"],
                    },
                },
                loginUser: {
                    attributes: {},
                },
            },
        }
    );
    return User;
};
