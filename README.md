# To-Do List Application

## Description

A simple To-Do List application that allows users to create, edit, delete, and mark tasks as completed. The application has both frontend and backend components.

## Technologies Used

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- Database: MongoDB

## Features

- User registration and authentication
- Add new tasks
- Edit existing tasks
- Mark tasks as completed
- Delete tasks
- Sorting and filtering tasks
- Drag-and-drop functionality to reorder tasks

## Setup Instructions

1. **Clone the repository**:

   ```bash
   git clone https://github.com/0x5un5h1n3/todo-list-app.git
   cd todo-list-app
   ```

2. **Install backend dependencies**:

   ```bash
   cd backend
   npm install
   ```

3. **Create a .env file in the backend directory and add the following environment variables:**:

   ```bash
   MONGODB_URI=<your_mongodb_uri>
   PORT=3000
   JWT_SECRET=<your_jwt_secret>
   ```

   Replace <your_mongodb_uri> with the connection string for your MongoDB database.

4. **Start the backend server:**:

   ```bash
   cd backend
   npm start
   ```

5. **Open `index.html` in your browser.**

## Notes

- The application uses MongoDB as the database and Mongoose as the Object Data Modeling (ODM) library.
- The backend uses Express.js as the web framework and Node.js as the runtime environment.
- The frontend uses HTML, CSS, and JavaScript for the user interface and user experience.
- The application includes user registration and authentication using bcrypt for password hashing and JSON Web Tokens (JWT) for authentication tokens.
- The application includes sorting and filtering tasks using MongoDB's built-in sorting and filtering capabilities.
- The application includes drag-and-drop functionality to reorder tasks using JavaScript and HTML5 drag-and-drop APIs.
