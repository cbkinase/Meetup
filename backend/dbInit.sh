#!/bin/bash

# Check if DB_FILE does not exist, then run migrations and seed
if [ ! -f "$DB_FILE" ]; then
  npx dotenv sequelize-cli db:migrate
  npx dotenv sequelize-cli db:seed:all
fi

npm start
