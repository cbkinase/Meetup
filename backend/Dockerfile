FROM node:16

# Create a directory to hold the application
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

# Set the working directory in the container
WORKDIR /home/node/app

# Change user to 'node'
USER node

# Copy package.json and package-lock.json to the working directory
COPY --chown=node:node package*.json ./

# Install app dependencies
RUN npm install

# Change the ownership of the node_modules folder
USER root
RUN chown -R node:node /home/node/app
USER node

# Copy the app source to the working directory
COPY --chown=node:node . .

# Make port 8000 available to the world outside this container
EXPOSE 8000

# Start the app & create/seed DB if needed
CMD [ "bash", "./dbInit.sh" ]
