destination_file="backend/.env"
be_directory="backend/node_modules"
fe_directory="frontend/node_modules"
env_contents="PORT=8000
DB_FILE=db/dev.db
JWT_SECRET=VgQEn4xs1TYL++w7
JWT_EXPIRES_IN=604800
SCHEMA=custom_schema_name"

# Create .env if it doesn't exist

if [ ! -f "$destination_file" ]; then
    # Copy the contents of .env.example into .env
    echo "$env_contents" > "$destination_file"

else
    echo "File $destination_file already exists"
fi


# Check if backend deps exists: install if not

if [ ! -d "$be_directory" ]; then
    cd backend
    echo "Installing backend dependencies and creating/seeding database. This may take a few minutes."
    npm i && npx dotenv sequelize-cli db:migrate && npx dotenv sequelize-cli db:seed:all
    cd ..
else
    echo "Starting up Meetup!!!"
fi


# Check if frontend deps exists

if [ ! -d "$fe_directory" ]; then
    echo "Directory does not exist: $fe_directory"
    echo "Installing frontend dependencies. This may take some time."
    cd frontend
    npm install
    cd ..
else
    echo "Directory exists: $fe_directory"
fi

cd frontend

# Spawn processes in a subshell and trap SIGINT to kill 0
# (See https://stackoverflow.com/a/52033580 for more)

(trap 'kill 0' SIGINT; npm start & cd ../backend && npm start & wait)
