# Credify

## Description
Credify is a full-stack banking application built using React for the frontend and Node.js with Express for the backend. It allows users to perform banking operations securely and efficiently.

## Project Structure Overview

### 1. Frontend
The frontend of Credify is built using React and Vite. Below are the key components in this section:

- **client/**: This directory contains the client-side code.
  - **index.html**: The main HTML file that serves as the entry point for the React application, including the root div where the React app will be rendered.
  - **package.json**: Contains metadata about the frontend project, including dependencies like React and development tools such as ESLint and Vite.
  - **vite.config.js**: Configuration file for Vite, specifying how the development server and build process should behave.
  - **hashPassword.js**: A utility function to hash passwords using bcrypt for secure user authentication.

### 2. Backend
The backend of Credify is built using Node.js and Express. Below are the key components in this section:

- **server/**: This directory contains the server-side code.
  - **server.js**: The main entry point for the backend application, where the Express server is set up and configured to handle incoming requests.
  - **package.json**: Contains metadata about the backend project, including dependencies such as Express and Mongoose for database interactions.

### 3. Configuration Files
- **.gitignore**: Specifies files and directories that should be ignored by Git, such as logs and dependency directories (e.g., node_modules).
- **README.md**: Provides an overview of the entire project, including usage and contribution guidelines.

## Detailed Descriptions of Key Files

### Frontend

#### index.html
```html
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Credify</title>
</head>
<body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
</body>
</html>
```
Sets up the basic HTML structure and links to the main JavaScript file where the React app is initialized.

#### package.json (Frontend)
```json
{
  "name": "frontend",
  "version": "0.0.0",
  "dependencies": {
    "axios": "^1.13.2",
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "react-router-dom": "^7.9.5"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^5.0.4",
    "vite": "^7.1.7"
  }
}
```
Lists the dependencies required for the frontend, including libraries for making HTTP requests and managing routing.

#### vite.config.js
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
});
```
Configures Vite to use the React plugin and sets the development server port.

### Backend

#### server.js
```javascript
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```
Sets up the Express server, connects to MongoDB, and listens for incoming requests.

#### package.json (Backend)
```json
{
  "name": "backend",
  "version": "1.0.0",
  "dependencies": {
    "bcryptjs": "^3.0.3",
    "cors": "^2.8.5",
    "dotenv": "^17.2.3",
    "express": "^5.1.0",
    "mongoose": "^8.19.3"
  },
  "devDependencies": {
    "nodemon": "^3.1.10"
  }
}
```
Lists the backend dependencies, including middleware for handling CORS, environment variables, and MongoDB interaction.

### Utility Script

#### hashPassword.js
```javascript
import bcrypt from 'bcryptjs';

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};
```
A utility function to hash passwords securely using bcrypt, which is crucial for user authentication.

## SonarQube Integration

### Overview
SonarQube is a tool for continuous inspection of code quality, providing detailed reports on bugs, vulnerabilities, and code smells.

### Project Configuration
- **sonar-project.properties**: Configures the project for SonarQube analysis, specifying the project key, name, version, and source directories.

## CircleCI Integration

### Overview
CircleCI is a continuous integration and continuous deployment (CI/CD) platform that automates the testing and deployment of applications.

### Configuration
- **.circleci/config.yml**: Defines the CI/CD pipeline, specifying jobs for building the application, installing dependencies, and running tests.

## SWIFT Payment System Integration

### Overview
The SWIFT (Society for Worldwide Interbank Financial Telecommunication) payment system provides a standardized way for banks and financial institutions to send and receive information about financial transactions securely.

### Functionality
- **SWIFT Message Builder**: Implements functions to create and send SWIFT messages for transactions, ensuring secure and standardized communication between banks.
- **Transaction Monitoring**: Monitors the status of SWIFT transactions and handles responses accordingly.

## Conclusion
Credify provides a structured approach to banking operations, leveraging modern technologies for both frontend and backend development. The application emphasizes security, efficiency, and a clear separation of concerns, making it easier to manage and develop each part independently.

Feel free to ask if you need further details or assistance with specific components!
