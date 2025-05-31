FROM node:20-alpine AS base

# Set working directory for the clone
WORKDIR /temp_clone

# Install git
RUN apk add --no-cache git

# Clone the LaunchLinks repository (user should update this to their fork)
# This approach assumes the Dockerfile is NOT in the root of the repo being cloned.
# If it IS in the root, this clone step is not needed and COPY . /app should be used.
RUN git clone https://github.com/your-repo/launchlinks.git .

# Set the final working directory
WORKDIR /app

# Copy the cloned application code to the final working directory
COPY --from=base /temp_clone .

# Install dependencies
# Using --legacy-peer-deps as it was needed in other parts of the project setup
# Using `ci` for cleaner installs in CI/Docker environments
RUN npm ci --legacy-peer-deps --ignore-scripts

# Copy entrypoint script from the 'docker' subdirectory of the cloned repo
# This assumes entrypoint.sh is located at `docker/entrypoint.sh` within your repository structure.
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Build the Next.js application
RUN npm run build

# Expose the port Next.js runs on
EXPOSE 3000

# Start command using the entrypoint script
CMD ["/entrypoint.sh"]