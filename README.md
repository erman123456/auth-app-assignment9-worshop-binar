# Auth App

This project is a full-stack authentication application built with TypeScript, featuring user registration and login functionalities. The application consists of a backend built with Express and a frontend built with React.

## Project Structure

```
auth-app
├── backend
│   ├── src
│   │   ├── controllers
│   │   │   ├── authController.ts
│   │   ├── models
│   │   │   └── user.ts
│   │   ├── routes
│   │   │   └── authRoutes.ts
│   │   ├── services
│   │   │   └── authService.ts
│   │   └── app.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend
│   ├── src
│   │   ├── components
│   │   │   ├── LoginForm.tsx
│   │   │   └── RegisterForm.tsx
│   │   ├── api
│   │   │   └── authApi.ts
│   │   └── App.tsx
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## Features

- User Registration: Users can create an account using their email and password.
- User Login: Users can log in to their accounts using their credentials.
- Data Validation: User data is validated on the backend before being stored.
- Secure Authentication: Passwords are hashed and tokens are generated for secure sessions.

## Getting Started

### Prerequisites

- Node.js
- npm or yarn

### Backend Setup

1. Navigate to the `backend` directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the backend server:
   ```
   npm start
   ```

### Frontend Setup

1. Navigate to the `frontend` directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the frontend application:
   ```
   npm start
   ```

## Usage

- Access the frontend application in your browser at `http://localhost:3000`.
- Use the registration form to create a new account.
- After registration, log in using the credentials you just created.

## Flow Implementation

1. **User Registration**:
   - User fills out the registration form.
   - Frontend sends a POST request to the backend `/register` endpoint.
   - Backend validates the data and hashes the password.
   - User data is saved in the database.

2. **User Login**:
   - User fills out the login form.
   - Frontend sends a POST request to the backend `/login` endpoint.
   - Backend validates the credentials and generates a token if successful.
   - Token is returned to the frontend for session management.

## Conclusion

This project demonstrates a simple yet effective way to implement user authentication using TypeScript, Express, and React. It can be extended with additional features such as password recovery, email verification, and user profile management.