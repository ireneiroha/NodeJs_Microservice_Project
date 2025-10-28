# Use official Node.js image
FROM node:18

# Create app directory
WORKDIR /app

# Copy package files first for caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Expose port
EXPOSE 3003

# Start the app
CMD ["node", "index.js"]
