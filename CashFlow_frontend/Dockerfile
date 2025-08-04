# Use the official Node.js Alpine image to build the React app
FROM node:24-alpine AS build

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies and log the output
RUN npm install >> /usr/src/app/build_logs.txt 2>&1

# Copy the rest of the application code
COPY . .

# Build the React app and log the output
RUN npm run build >> /usr/src/app/build_logs.txt 2>&1

# Use Nginx to serve the static files
FROM nginx:alpine

# Copy the build files from the previous stage
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

COPY react-app.conf /etc/nginx/conf.d/react-app.conf

# Expose port 80 for Nginx
EXPOSE 80

# Start Nginx with log redirection
CMD ["nginx", "-g", "daemon off;"]

# Copy build logs to be accessible from the container
COPY --from=build /usr/src/app/build_logs.txt /usr/share/nginx/html/build_logs.txt