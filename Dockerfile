# Use an offficial Node.js runtime as a parent image
FROM node:22-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json files to the container
COPY package*.json .
COPY client/package*.json ./client/

# Install dependencies
RUN npm install
RUN npm install --prefix client

# Copy the rest of the application code to the container
COPY . .

# Build the React client
RUN npm --prefix client run build

# Expose the port the app runs on
EXPOSE 5001

#Define the command to run the application
CMD ["sh", "-c", "npx prisma generate && npx prisma db push --accept-data-loss && node ./src/server.js"]
