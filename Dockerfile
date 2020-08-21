FROM node:12

# Create and change to the app directory.
WORKDIR /home/node/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
# Copying this separately prevents re-running npm install on every code change.
COPY package.json yarn.lock ./

# Install production dependencies.
RUN yarn

# Copy local code to the container image.
COPY . .

RUN yarn build

# Run the web service on container startup.
CMD [ "yarn", "start" ]