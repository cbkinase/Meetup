"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA;
}

module.exports = {
    up: async (queryInterface, Sequelize) => {
        options.tableName = "Events";
        return queryInterface.bulkInsert(
            options,
            [
                {
                    venueId: 1,
                    groupId: 1,
                    name: "Best event",
                    description: "You heard it here",
                    type: "In person",
                    capacity: 20,
                    price: 20,
                    startDate: new Date(2023, 4, 1),
                    endDate: new Date(2023, 4, 2),
                },
                {
                    venueId: 2,
                    groupId: 2,
                    name: "Not so good event",
                    description: "Take it or leave it",
                    type: "In person",
                    capacity: 30,
                    price: 10,
                    startDate: new Date(2023, 5, 1),
                    endDate: new Date(2023, 5, 2),
                },
                {
                    venueId: 3,
                    groupId: 1,
                    name: "RLCS Watch Party",
                    description: "GenG or KC?",
                    type: "In person",
                    capacity: 20,
                    price: 20,
                    startDate: new Date(2023, 6, 1),
                    endDate: new Date(2023, 6, 2),
                },
            ],
            {}
        );
    },

    down: async (queryInterface, Sequelize) => {
        options.tableName = "Events";
        const Op = Sequelize.Op;
        return queryInterface.bulkDelete(
            options,
            {
                type: {
                    [Op.in]: ["Online", "In person"],
                },
            },
            {}
        );
    },
};
