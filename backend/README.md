# Smart Installation System - Backend

This is the backend API for the Smart Installation System, built with Node.js, Express, TypeScript, and MongoDB.

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.0 or higher) with replica set enabled
- npm or yarn

### MongoDB Replica Set Setup

MongoDB transactions require a replica set. If you're running MongoDB locally, you need to enable replica set mode.

1. Start MongoDB with replica set:
   ```bash
   mongod --replSet rs0
   ```

2. In another terminal, connect to MongoDB and initiate replica set:
   ```bash
   mongo
   rs.initiate()
   ```

3. Verify replica set status:
   ```bash
   rs.status()
   ```

For production, ensure your MongoDB deployment has replica set configured.

## Installation

1. Clone the repository and navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file by copying the example:
   ```bash
   cp .env.example .env
   ```

   Then edit `.env` with your actual values:
   ```
   MONGO_URI=mongodb://localhost:27017/smart_installation?replicaSet=rs0
   JWT_SECRET=your_jwt_secret_here
   PORT=3000
   ```

   Replace `your_jwt_secret_here` with a secure random string.

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Generate Slots
To populate the database with appointment slots:
```bash
npm run generate-slots
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Slots
- `GET /api/slots?date=YYYY-MM-DD` - Get available slots for a date

### Appointments
- `POST /api/slots/appointments/book` - Book an appointment
- `GET /api/slots/appointments/my` - Get user's appointments
- `POST /api/slots/appointments/:id/cancel` - Cancel an appointment

## Project Structure

```
backend/
├── src/
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Authentication middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   └── server.ts        # Express app setup
├── .env                 # Environment variables
├── package.json
├── tsconfig.json
└── README.md
```

## Technologies Used

- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

## License

This project is licensed under the MIT License.