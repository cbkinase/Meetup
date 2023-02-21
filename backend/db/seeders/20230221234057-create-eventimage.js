"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA;
}

module.exports = {
    up: async (queryInterface, Sequelize) => {
        options.tableName = "EventImages";
        return queryInterface.bulkInsert(
            options,
            [
                {
                    eventId: 1,
                    url: "banana",
                    preview: true,
                },
                {
                    eventId: 2,
                    url: "banana",
                    preview: true,
                },
                {
                    eventId: 3,
                    url: "banana",
                    preview: true,
                },
                {
                    eventId: 3,
                    url: "banana",
                    preview: false,
                },
            ],
            {}
        );
    },

    down: async (queryInterface, Sequelize) => {
        options.tableName = "EventImages";
        const Op = Sequelize.Op;
        return queryInterface.bulkDelete(
            options,
            {
                preview: {
                    [Op.in]: [true, false],
                },
            },
            {}
        );
    },
};
