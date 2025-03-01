# Use a Node.js base image
FROM node:18

# Set working directory inside container
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the project files
COPY . .

# Expose the frontend port
EXPOSE 3000

# Run the frontend app
CMD ["npm", "start"]
