# Node.js & TypeScript Authentication System

A robust and scalable authentication system built with Node.js, Express.js, TypeScript, and MongoDB, utilizing JSON Web Tokens (JWT) for secure authentication. This project serves as a foundation for any Node.js application requiring user registration, login, and role-based access control.

## Features

- **User Registration**: Secure user registration with password hashing.
- **User Login**: Authentication using JWT, with token generation.
- **Role-Based Access Control**: Basic user roles (e.g., user, admin) for managing access.
- **Middleware for Authentication**: Protect routes with custom middleware to ensure only authenticated users can access them.
- **TypeScript for Strong Typing**: Fully typed project to catch errors early and improve maintainability.

# API Endpoints

## Auth

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and obtain a JWT
- `POST /auth/verify-email` - Verify a user's email address
- `POST /auth/forgot-password` - Send a password reset email
- `POST /auth/reset-password` - Reset a user's password
- `POST /auth/logout` - Logout a user (protected)

## User

- `GET /users` - Get all users (protected)
- `GET /users/:id` - Get user details by ID (protected)
- `PUT /users/:id` - Update user details by ID (protected)
- `DELETE /users/:id` - Delete a user (protected)

# Installation

To get started with this project, clone the repository and install the dependencies:

```bash
git clone https://github.com/ferhatkefsiz/express-auth-system.git
```

```bash
cd express-auth-system
```

```bash
npm install
```

# Environment Variables

Create a `.env` file in the root of the project and add the following variables:

```file
PORT=
TOKEN_SECRET=
MONGODB_URI=
RESEND_API_KEY=
EMAIL_SENDER=onboarding@resend.dev
EMAIL_RECIPIENT=
```

# Running the Project

To start the development server, use the following command:

```bash
npm run start:dev
```

# Contributing

Contributions are welcome! Please fork this repository and submit a pull request for any enhancements or bug fixes.
