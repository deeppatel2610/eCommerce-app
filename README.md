# eCommerce App

A full-featured eCommerce REST API built with **Node.js**, **Express**, and **MongoDB**. It supports user authentication, product management with image uploads, and comes with auto-generated Swagger API documentation.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express v5 |
| Database | MongoDB (Mongoose) |
| Templating | EJS |
| Auth | JWT + bcrypt + express-session |
| File Uploads | Multer |
| Validation | express-validator + validator |
| API Docs | swagger-autogen + swagger-ui-express |
| Dev Tool | Nodemon |

---

## Project Structure

```
eCommerce-app/
├── controllers/      # Route handler logic
├── middleware/       # Auth and other middleware
├── models/           # Mongoose schemas
├── routes/           # Express route definitions
├── views/            # EJS templates
├── utils/            # Helper utilities
├── productImages/    # Uploaded product images
├── index.js          # App entry point
├── swagger.js        # Swagger config generator
└── swagger-output.json
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB (local or Atlas)

### Installation

```bash
# Clone the repo
git clone https://github.com/deeppatel2610/eCommerce-app.git
cd eCommerce-app

# Install dependencies
npm install
# or on Windows, run the provided script:
install-deps.bat
```

### Environment Variables

Create a `.env` file in the root:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret
```

### Run the App

```bash
npm start        # starts with nodemon (auto-reload)
```

---

## API Documentation

Swagger UI is available at:

```
http://localhost:3000/api-docs
```

To regenerate the Swagger output after route changes:

```bash
node swagger.js
```

---

## Key Features

- **User Auth** — Register, login, and session management with JWT and bcrypt-hashed passwords
- **Product Management** — CRUD operations with image upload support via Multer
- **Input Validation** — Server-side validation using express-validator
- **CORS Support** — Cross-origin requests enabled via the `cors` package
- **Request Logging** — HTTP request logs via Morgan
- **API Docs** — Auto-generated and interactive Swagger documentation
