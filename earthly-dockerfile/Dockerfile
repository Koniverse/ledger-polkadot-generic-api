# Stage 1: Build Rust
FROM rust:1.74-bookworm as builder

# Set the working directory in the container
WORKDIR /app

RUN apt update && apt install -y nodejs curl npm
RUN npm install --global corepack
RUN corepack enable

# Copy package.json, yarn.lock
COPY package.json yarn.lock ./
RUN yarn install

# Copy source files
COPY rust ./rust
COPY src ./src
COPY tsconfig.json ./

# Compile Rust project
RUN yarn build

# Stage 2: Final
FROM node:20-slim

# Set the working directory in the container
WORKDIR /app

RUN corepack enable

# Copy package.json, yarn.lock
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn

# Install production dependencies only
RUN yarn workspaces focus --production

# Copy the transpiled JavaScript from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/rust/index.node ./dist/rust/
COPY --from=builder /app/rust/index.d.ts ./dist/rust/

# Set the command to start the node server
CMD ["node", "dist/src/index.js"]
