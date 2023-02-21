"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable(
            "Events",
            {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER,
                },
                venueId: {
                    type: Sequelize.INTEGER,
                    references: { model: "Venues", key: "id" },
                    onDelete: "CASCADE",
                },
                groupId: {
                    type: Sequelize.INTEGER,
                    references: { model: "Groups", key: "id" },
                    onDelete: "CASCADE",
                },
                name: {
                    type: Sequelize.STRING,
                },
                description: {
                    type: Sequelize.TEXT,
                },
                type: {
                    type: Sequelize.ENUM,
                },
                capacity: {
                    type: Sequelize.INTEGER,
                },
                price: {
                    type: Sequelize.INTEGER,
                },
                startDate: {
                    type: Sequelize.DATE,
                },
                endDate: {
                    type: Sequelize.DATE,
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
        options.tableName = "Events";
        await queryInterface.dropTable(options);
    },
};
