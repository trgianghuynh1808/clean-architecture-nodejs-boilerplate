# Use the official Node 18.12.1 LTS image as the base image
FROM node:18

# Set the name of the image
LABEL name="kasp-core-service"

# Set the working directory inside the container
WORKDIR /usr/src/app

# create folders
RUN mkdir /usr/src/app/_env
RUN mkdir /usr/src/app/logs

# Copy the application code to the working directory
COPY dist ./dist
COPY package.json yarn.lock ./

# Install the application dependencies
RUN yarn install

# Expose the port on which your application will run
EXPOSE 4029

# config default environment variables
ENV NODE_ENV="production" NODE_HOST="0.0.0.0" NODE_PORT=4029

# Define the command to start your application
CMD node dist/index.js
