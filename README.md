# Meetup

## Intro

This is a Meetup clone, presently hosted <a href="https://cameron-meetup-auth.onrender.com/">on Render</a>. Come check it out!

## Technologies used

- Backend: Node.js, Express.js, Sequelize
- Frontend: React, Redux

## Demo

<img src="https://i.gyazo.com/e5db80fd551a65e48d7f5c62f957c020.png">

## How to Use Locally

1. Copy this repository.
2. Configure your .env in backend according to .env.example
3. Run the following command in the 'backend' directory: ```npm i && npx dotenv sequelize-cli db:migrate && npx dotenv sequelize-cli db:seed:all && npm start```
4. Run the following command in the 'frontend' directory: ```npm i && npm start```
5. Your backend should now be accessible at localhost:8000, and your frontend at localhost:3000.
