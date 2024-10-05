# backend/Dockerfile
# Use the official Node.js image
FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port (update with your API port)
EXPOSE 4000

# Start the application
CMD ["node", "app.js"]  # Update with your main file name
