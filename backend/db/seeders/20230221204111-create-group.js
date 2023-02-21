"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add seed commands here.
         *
         * Example:
         * await queryInterface.bulkInsert('People', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
         */
        options.tableName = "Groups";
        return queryInterface.bulkInsert(
            options,
            [
                {
                    organizerId: 1,
                    name: "Cool group",
                    about: "Pretty cool",
                    type: "In person",
                    private: false,
                    city: "New York",
                    state: "NY",
                },
                {
                    organizerId: 2,
                    name: "Cooler group",
                    about: "Way, way cooler",
                    type: "In person",
                    private: false,
                    city: "New York City",
                    state: "NY",
                },
                {
                    organizerId: 1,
                    name: "Mid group",
                    about: "cool-ish",
                    type: "Online",
                    private: true,
                    city: "Albany",
                    state: "NY",
                },
            ],
            {}
        );
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        options.tableName = "Groups";
        const Op = Sequelize.Op;
        return queryInterface.bulkDelete(
            options,
            {
                name: {
                    [Op.in]: ["Cool group", "Cooler group", "Mid group"],
                },
            },
            {}
        );
    },
};
