# Use Node.js LTS version as the base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies for bcrypt compilation
RUN apk add --no-cache python3 make g++

# Copy package.json and package-lock.json for backend
COPY package*.json ./

# Install backend dependencies
RUN npm install --production

# Copy client package.json and package-lock.json
COPY client/package*.json ./client/

# Install client dependencies
WORKDIR /app/client
RUN npm install --legacy-peer-deps

# Return to app directory
WORKDIR /app

# Copy the rest of the application code
COPY . .

# Build the React client
WORKDIR /app/client
RUN npm run build

# Return to app directory
WORKDIR /app

# Expose the port the app runs on
EXPOSE 5000

# Create a non-root user and switch to it
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /app
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD node -e "const http = require('http'); const options = { hostname: 'localhost', port: 5000, path: '/', method: 'GET' }; const req = http.request(options, (res) => { if (res.statusCode === 200 || res.statusCode === 401) { process.exit(0); } else { process.exit(1); } }); req.on('error', () => process.exit(1)); req.end();"

# Command to run the application
CMD ["node", "app.js"]
