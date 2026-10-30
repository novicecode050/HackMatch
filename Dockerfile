# Use lightweight official Node.js LTS image
FROM node:18-alpine

# Set working directory inside container
WORKDIR /usr/src/app

# Copy package dependency files
COPY package*.json ./

# Install production dependencies
RUN npm install --production

# Copy application source code
COPY . .

# Expose container port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
