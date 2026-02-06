# Odin Book API (Backend)

[![Backend Code](https://img.shields.io/badge/Code-Backend_Repo-black?style=for-the-badge)](https://github.com/inebw/odin-book-api)
[![Frontend Code](https://img.shields.io/badge/Code-Frontend_Repo-black?style=for-the-badge)](https://github.com/inebw/odin-book)

## 📖 About The Project

This is the RESTful API and WebSocket server powering the **Odin Book** social media platform. It handles complex relational data, real-time event broadcasting, and secure user authentication.

Built with **Node.js** and **Express**, it leverages **Prisma ORM** to interface with a PostgreSQL database, ensuring type safety and efficient query performance.

## ⚡ Tech Stack

| Domain         | Technologies                       |
| :------------- | :--------------------------------- |
| **Runtime**    | Node.js, Express.js                |
| **Database**   | PostgreSQL, Prisma ORM             |
| **Real-Time**  | Socket.io (Events & Broadcasting)  |
| **Auth**       | Passport.js (JWT Strategy), BCrypt |
| **Storage**    | Supabase Storage (Image Uploads)   |
| **Validation** | Express-Validator                  |

## 🚀 Key Features

### 🔐 Security & Authentication

- **JWT-Based Auth:** Stateless authentication using JSON Web Tokens stored in HTTP-Only cookies.
- **Environment Awareness:** Automatic cookie configuration (`Secure`, `SameSite`) that adapts between Localhost and Production environments.
- **Input Sanitization:** Robust middleware chains using `express-validator` to prevent injection attacks and ensure data integrity.

### 📡 Real-Time Engine (Socket.io)

- **Event-Driven Architecture:** A centralized socket handler (`app.js`) manages 20+ distinct events including `likePost`, `createChat`, and `imOnline`.
- **Room Management:** Uses Socket.io "Rooms" to broadcast messages only to relevant users (e.g., active chat participants).

### 💾 Data Management (Prisma)

- **Polymorphic Interactions:** A unified pattern for handling Likes/Dislikes across Posts, Comments, and Replies.
- **Complex Queries:** Efficient usage of Prisma's `include` and `select` to fetch deeply nested data (Post -> Comments -> Replies -> Author) in single database trips.
- **Trending Algorithm:** Custom logic to calculate "Trending Posts" based on recency (last 48h) and interaction velocity.

### ☁️ Cloud Integration

- **Image Hosting:** Direct integration with **Supabase Storage** for user avatars and post images.
- **Robohash Fallback:** Automatic generation of unique identicon avatars for users who haven't uploaded a profile picture.

## 📂 Project Structure

- `/controllers`: Business logic separated by domain (`post.js`, `user.js`, `message.js`).
- `/routes`: Express router definitions.
- `/prisma`: Database schema and migration history.
- `/config`: Third-party service configurations (Supabase, Passport).
- `app.js`: Entry point and WebSocket event map.

