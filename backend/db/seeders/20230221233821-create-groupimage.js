"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA;
}

module.exports = {
    up: async (queryInterface, Sequelize) => {
        options.tableName = "GroupImages";
        return queryInterface.bulkInsert(
            options,
            [
                {
                    groupId: 1,
                    url: "banana",
                    preview: true,
                },
                // {
                //     groupId: 2,
                //     url: "banana",
                //     preview: true,
                // },
                {
                    groupId: 3,
                    url: "banana",
                    preview: true,
                },
                {
                    groupId: 3,
                    url: "banana2",
                    preview: false,
                },
            ],
            {}
        );
    },

    down: async (queryInterface, Sequelize) => {
        options.tableName = "GroupImages";
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
