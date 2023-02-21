"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable(
            "Groups",
            {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER,
                },
                organizerId: {
                    type: Sequelize.INTEGER,
                    references: { model: "Users", key: "id" },
                    onDelete: "CASCADE",
                },
                name: {
                    type: Sequelize.STRING(256),
                },
                about: {
                    type: Sequelize.TEXT,
                },
                type: {
                    type: Sequelize.ENUM,
                },
                private: {
                    type: Sequelize.BOOLEAN,
                },
                city: {
                    type: Sequelize.STRING(100),
                },
                state: {
                    type: Sequelize.STRING(100),
                },
                createdAt: {
                    allowNull: false,
                    type: Sequelize.DATE,
                    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
                },
                updatedAt: {
                    allowNull: false,
                    type: Sequelize.DATE,
                    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
                },
            },
            options
        );
    },
    async down(queryInterface, Sequelize) {
        options.tableName = "Groups";
        await queryInterface.dropTable(options);
    },
};
