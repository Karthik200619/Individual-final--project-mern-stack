# CampusKart Backend

Backend API server for CampusKart built with Node.js, Express.js, MongoDB Atlas, JWT authentication, Cloudinary media storage, and Brevo email integration.

## Features

* Authentication APIs
* OTP Verification
* Campus Management
* Product Listings
* Cart Management
* Orders & Deliveries
* Messaging System
* Notifications
* Discounts & Coupons
* Feedback & Help Center

## Technologies

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT
* bcryptjs
* Multer
* Busboy
* Cloudinary
* Nodemailer
* Brevo SMTP

## Installation

npm install

## Run Development Server

npm run dev

## Environment Variables

MONGO_URI=
JWT_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

EMAIL_USER=
EMAIL_PASS=

## API Modules

### Authentication

/common-api/login
/common-api/logout
/common-api/refresh

### OTP

/common-api/sendotp
/common-api/verifyotp
/common-api/verify-register-otp

### User

/user-api/register
/user-api/items
/user-api/additem
/user-api/cart

### Orders

/user-api/buyitem
/user-api/myorders
/user-api/sellerorders

### Chat

/user-api/chat/send
/user-api/chat/messages

### Help Center

/user-api/help-queries

## Deployment

Render + MongoDB Atlas + Cloudinary + Brevo
