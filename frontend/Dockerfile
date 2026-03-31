# syntax=docker/dockerfile:1
ARG NODE_VERSION=22.16.0
FROM node:${NODE_VERSION}-alpine AS base
# Set working directory for all build stages.
WORKDIR /app

FROM base AS deps

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

FROM deps AS build

# Install Doppler CLI
RUN wget -q -t3 'https://packages.doppler.com/public/cli/rsa.8004D9FF50437357.key' -O /etc/apk/keys/cli@doppler-8004D9FF50437357.rsa.pub && \
    echo 'https://packages.doppler.com/public/cli/alpine/any-version/main' | tee -a /etc/apk/repositories && \
    apk add doppler

# Accept DOPPLER_TOKEN as build argument
ARG DOPPLER_TOKEN
ENV DOPPLER_TOKEN=${DOPPLER_TOKEN}

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

COPY . .

# Run the build script.
RUN npm run build:prod

FROM build AS dev

EXPOSE 3000
CMD ["npm", "run", "dev"]

FROM base AS stage

# Use production node environment by default.
ENV NODE_ENV=production

# Run the application as a non-root user.
USER node

# Copy package.json so that package manager commands can be used.
COPY package*.json .

COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

# Expose the port that the application listens on.
EXPOSE 5173
CMD ["npm", "run", "preview"]

FROM nginx:alpine AS production

# Create a non-root user to run nginx and app directory
RUN adduser -D -H -u 1001 -s /sbin/nologin webuser \
    && mkdir -p /app/www

# Copy built assets from build stage
COPY --from=build /app/dist /app/www

# Copy nginx config template
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Set correct ownership and permissions
RUN chown -R webuser:webuser /app/www && \
    chmod -R 755 /app/www && \
    # Nginx needs to read and write to these directories
    chown -R webuser:webuser /var/cache/nginx && \
    chown -R webuser:webuser /var/log/nginx && \
    chown -R webuser:webuser /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R webuser:webuser /var/run/nginx.pid && \
    chmod -R 777 /etc/nginx/conf.d

EXPOSE 80

# Switch to the non-root user
USER webuser

CMD ["nginx", "-g", "daemon off;"]