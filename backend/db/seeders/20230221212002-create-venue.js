"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA;
}

module.exports = {
    up: async (queryInterface, Sequelize) => {
        options.tableName = "Venues";
        return queryInterface.bulkInsert(
            options,
            [
                {
                    groupId: 1,
                    address: "123 Address St",
                    city: "MUC",
                    state: "NY",
                    lat: 40.74844,
                    lng: -73.985664,
                },
                {
                    groupId: 2,
                    address: "456 Creative Dr",
                    city: "AMU",
                    state: "NJ",
                    lat: 39.0826,
                    lng: -74.8238,
                },
                {
                    groupId: 1,
                    address: "789 Fake Rd",
                    city: "CC",
                    state: "NY",
                    lat: 40.84844,
                    lng: -73.985664,
                },
            ],
            {}
        );
    },

    down: async (queryInterface, Sequelize) => {
        options.tableName = "Venues";
        const Op = Sequelize.Op;
        return queryInterface.bulkDelete(
            options,
            {
                state: {
                    [Op.in]: ["NY", "NJ"],
                },
            },
            {}
        );
    },
};
