"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA;
}

module.exports = {
    up: async (queryInterface, Sequelize) => {
        options.tableName = "Attendances";
        return queryInterface.bulkInsert(
            options,
            [
                {
                    eventId: ,
                    userId: ,
                    status: ,
                },
                {
                    eventId: ,
                    userId: ,
                    status: ,
                },
                {
                    eventId: ,
                    userId: ,
                    status: ,
                },
            ],
            {}
        );
    },

    down: async (queryInterface, Sequelize) => {
        options.tableName = "Attendances";
        const Op = Sequelize.Op;
        return queryInterface.bulkDelete(
            options,
            {
                AAAA: {
                    [Op.in]: [],
                },
            },
            {}
        );
    },
};
