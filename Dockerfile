FROM 318730995815.dkr.ecr.us-east-1.amazonaws.com/node:12

# Create and change to the app directory.
WORKDIR /home/node/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
# Copying this separately prevents re-running npm install on every code change.
COPY package.json yarn.lock ./

ARG API_BASE_URL
ARG TEST_ENV
ARG FIRE_API_KEY
ARG FIRE_AUTH_DOMAIN
ARG FIRE_DATABASE_URL
ARG FIRE_PROJECT_ID
ARG FIRE_STORAGE_BUCKET
ARG FIRE_MESSAGING_SENDER
ARG FIRE_APP_ID
ARG STRIPE_PUBLIC
ARG FRONTEND_URL
ARG GTM_ID
ARG DROPBOX_API_KEY
ARG GMT_NPM_TOKEN
ARG GOOGLE_PLACES_API_KEY
ARG KIDS_CORNER_URL
ARG PLAYGARDEN_ADMIN_URL

COPY .npmrc .en[v] ./

ENV API_BASE_URL="${API_BASE_URL}" \
  TEST_ENV="${TEST_ENV}" \
  FIRE_API_KEY="${FIRE_API_KEY}" \
  FIRE_AUTH_DOMAIN="${FIRE_AUTH_DOMAIN}" \
  FIRE_DATABASE_URL="${FIRE_DATABASE_URL}" \
  FIRE_PROJECT_ID="${FIRE_PROJECT_ID}" \
  FIRE_STORAGE_BUCKET="${FIRE_STORAGE_BUCKET}" \
  FIRE_MESSAGING_SENDER="${FIRE_MESSAGING_SENDER}" \
  FIRE_APP_ID="${FIRE_APP_ID}" \
  FRONTEND_URL="${FRONTEND_URL}" \
  STRIPE_PUBLIC="${STRIPE_PUBLIC}" \
  GTM_ID="${GTM_ID}" \
  DROPBOX_API_KEY="${DROPBOX_API_KEY}" \
  GMT_NPM_TOKEN="${GMT_NPM_TOKEN}" \
  GOOGLE_PLACES_API_KEY="${GOOGLE_PLACES_API_KEY}" \
  KIDS_CORNER_URL="${KIDS_CORNER_URL}" \
  PLAYGARDEN_ADMIN_URL="${PLAYGARDEN_ADMIN_URL}"

# Install production dependencies.
RUN GMT_NPM_TOKEN=${GMT_NPM_TOKEN} yarn

# Copy local code to the container image.
COPY . .

RUN yarn build

# Run the web service on container startup.
CMD [ "yarn", "start" ]
