# Contestify

Contestify is a full-stack MERN (MongoDB, Express, React, Node.js) application designed to help users create, manage, and participate in contests. It provides a robust RESTful API and a user-friendly frontend for seamless contest management.

## Table of Contents

- [Contestify](#contestify)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [API Endpoints](#api-endpoints)
    - [Auth](#auth)
  - [Setup Instructions](#setup-instructions)
  - [Sample Configuration](#sample-configuration)
  - [Project Structure](#project-structure)
  - [Technologies Used](#technologies-used)
  - [License](#license)

---

## Features

- **User Authentication:** Secure registration and login using JWT.
- **Contest Management:** Create, update, delete, and view contests.
- **Participation:** Join contests and view participant lists.
- **Results:** View contest results (if implemented).
- **Role-based Access:** Only authenticated users can create, update, or delete contests.
- **RESTful API:** Well-structured endpoints for frontend/backend integration.

---

## API Endpoints

### Auth

- `POST /api/auth/register`  
        Register a new user.  
        **Body:**  
        ```json
        {
            "username": "string",
            "email": "string",
            "password": "string"
        }
        ```
        **Response:**  
        - `201 Created` on success
        - `400 Bad Request` if user exists or data is invalid

- `POST /api/auth/login`  
        Authenticate a user and return a JWT token.  
        **Body:**  
        ```json
        {
            "email": "string",
            "password": "string"
        }
        ```
        **Response:**  
        - `200 OK` with `{ "token": "jwt_token" }`
        - `401 Unauthorized` on failure

---

## Setup Instructions

1. **Clone the repository:**
        ```bash
        git clone https://github.com/yourusername/contestify.git
        cd contestify
        ```

2. **Install server dependencies:**
        ```bash
        npm install
        ```

3. **Install client dependencies:**
        ```bash
        cd client
        npm install
        cd ..
        ```

4. **Configure environment variables:**  
        Create a `.env` file in the root directory (see [Sample Configuration](#sample-configuration)).

5. **Start the MongoDB server:**  
        Ensure MongoDB is running locally or update `MONGO_URI` in `.env` to point to your database.

6. **Run the server:**
        ```bash
        npm run dev
        ```
        The backend will start on the port specified in `.env` (default: 5000).

7. **Run the client:**
        ```bash
        cd client
        npm start
        ```
        The React frontend will start on [http://localhost:3000](http://localhost:3000).

---

## Sample Configuration

Create a `.env` file in the root directory with the following content:

```env
MONGO_URI=mongodb://localhost:27017/contestify
JWT_SECRET=your_jwt_secret
PORT=5000
CLIENT_URL=http://localhost:3000
```

- `MONGO_URI`: MongoDB connection string.
- `JWT_SECRET`: Secret key for JWT authentication.
- `PORT`: Port for the backend server.
- `CLIENT_URL`: URL where the frontend is served.

---

## Project Structure

```
contestify/
├── client/             # React frontend
├── models/             # Mongoose models
├── routes/             # Express route handlers
├── controllers/        # Business logic
├── middleware/         # Auth and other middleware
├── .env                # Environment variables
├── server.js           # Entry point for backend
└── README.md
```

---

## Technologies Used

- **Frontend:** React, Redux (if used), Axios
- **Backend:** Node.js, Express
- **Database:** MongoDB, Mongoose
- **Authentication:** JWT
- **Other:** dotenv, bcryptjs, cors

---

## License

This project is licensed under the MIT License.
