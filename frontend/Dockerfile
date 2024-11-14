# Stage 1: Build the React app
FROM node:16-alpine AS build

WORKDIR /app

# Copy the package files from the web directory and install dependencies
COPY web/package.json web/package-lock.json ./
RUN npm install --verbose

# Copy the shared and web directories into the container
COPY shared /app/shared
COPY web /app

# Run the build process
RUN npm run build --prefix /app

# Stage 2: Serve the React app using nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
