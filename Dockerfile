FROM node:22-slim

# Create app directory
WORKDIR /usr/src/app


# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm ci

# Bundle app source
COPY . .

# Build the TypeScript files
RUN npm run build

# Expose port 8080
EXPOSE 8080

# Configuring ENV here to remove one extra step
# can move it somewhere else in a prod use-case
ENV NODE_ENV="production"
ENV PORT="8080"       
ENV HOST="0.0.0.0"
ENV CORS_ORIGIN="http://localhost:*"


# Start the app
CMD npm run start
