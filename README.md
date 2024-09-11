# Donation API

## Project Goals

A donation platform API designed to facilitate charitable giving. The main goals of this project are:

1. Enable users to create accounts and manage their profiles.
2. Allow users to make donations to beneficiaries.
3. Provide a secure transaction system with PIN verification.
4. Track donation history.
5. Implement a wallet system for managing user balances.
6. Send thank-you messages to frequent donors.

## API Documentation

The API is documented using Swagger. You can access the full API documentation by running the server and visiting `/api-docs` endpoint.

### Base URL

`http://localhost:3000/api`

### Authentication

Most endpoints require JWT authentication. Include the JWT token in the Authorization header as a Bearer token.

### Endpoints

#### Users

1. **Register User**
   - POST `/users/register`
   - Request Body: `{ email, password, name }`
   - Response: `{ message: 'User created successfully' }`

2. **Login User**
   - POST `/users/login`
   - Request Body: `{ email, password }`
   - Response: `{ token, userId }`

3. **Create Transaction PIN**
   - POST `/users/transaction-pin`
   - Request Body: `{ userId, pin }`
   - Response: `{ message: 'Transaction PIN created successfully' }`

#### Wallets

1. **Get User Wallet**
   - GET `/wallets/:userId`
   - Response: `{ _id, userId, balance }`

#### Donations

1. **Create Donation**
   - POST `/donations`
   - Request Body: `{ donorId, beneficiaryId, amount }`
   - Response: `{ message: 'Donation created successfully' }`

2. **Get Donation Count**
   - GET `/donations/count/:userId`
   - Response: `{ count }`

3. **Get Donations by Period**
   - GET `/donations/period/:userId?startDate=<date>&endDate=<date>`
   - Response: `[{ _id, donorId, beneficiaryId, amount, createdAt }, ...]`

4. **Get Single Donation**
   - GET `/donations/:donationId`
   - Response: `{ _id, donorId, beneficiaryId, amount, createdAt }`

## Setup and Running the Server

1. Install dependencies:
   ```
   npm install
   ```

2. Set up environment variables in a `.env` file:
   ```
   PORT=3000
   MONGODB_URI=<your_mongodb_connection_string>
   JWT_SECRET=<your_jwt_secret>
   EMAIL_USER=<your_email_user>
   EMAIL_PASSWORD=<your_email_app_password>
   EMAIL_FROM=<your_email>
   ```

3. Build the project:
   ```
   npm run build
   ```

4. Start the server:
   ```
   npm start
   ```

   For development with hot-reloading:
   ```
   npm run start:dev
   ```

5. Access the Swagger documentation at `http://localhost:3000/api-docs`

## Technologies Used

- Node.js
- Express.js
- TypeScript
- MongoDB with Mongoose
- Passport.js for authentication
- Joi for input validation
- Swagger for API documentation


