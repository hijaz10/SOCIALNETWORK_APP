# School Social Network – Backend API

A backend service for a school only social networking platform, built to enable secure communication and interaction among students. The system restricts access to verified school email addresses and supports real time messaging, posts, and user engagement features.

## Features

* Secure user authentication and authorization with signup/login restricted to school email domains
* Real-time messaging between users using Socket.io
* CRUD operations for posts, likes, and user profiles
* Rate limiting to prevent abuse and ensure platform stability
* RESTful API design with clean, modular routing

## Tech Stack

* Backend: Node.js, Express
* Database: MongoDB
* Libraries: Socket.io
* Security:Rate limiting, protected routes
* Deployment: AWS

## Architecture Overview

The application follows a modular backend architecture with separated concerns for authentication, messaging, posts, and user management. Realtime communication is handled via WebSockets, while core platform functionality is exposed through REST APIs.

## Getting Started

Prerequisites

* Node.js
* MongoDB

Installation

git clone https://github.com/hijaz10/<repo-name>.git
cd SOCIALNETWORK_APP/socialmedia/backend
npm install


Environment Variables

Create a .env file in the root directory:

PORT=5000
MONGO_URI
JWT_SECRET
EMAIL_USER -> FOR SENDING EMAILS
EMAIL_PASS
REDIS_UR -> FOR CACHE
ARCJET_KEY -> FOR RATE LIMITING AND BOT DETETCTION




### Run Locally

npm run dev


## Deployment

The backend is deployed on AWS and configured for production use with environment-based configuration and secure access.


## API Documentation

A Postman collection is available to explore and test the API endpoints:

* Postman Collection: https://www.postman.com/satellite-astronaut-6759285/workspace/socialnetwork-app


## Author

Muhammad Yakubu Muhammad
Backend Developer
LINKDIN: www.linkedin.com/in/muhdhijaz



Feel free to explore the codebase, test the APIs, or reach out with feedback.
