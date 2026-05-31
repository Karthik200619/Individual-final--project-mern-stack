# CampusKart - Campus Buy & Sell Platform

CampusKart is a full-stack MERN marketplace built exclusively for college students. The platform enables students to buy, sell, exchange, and manage products securely within their campus ecosystem using verified institutional email authentication.

## FOR TESTING OF ADMIN USE this mail and PASSWORD
* email:admin@anurag.edu.in
*Password:Admin@1234

## FOR TESTING USER USE 
* email:23eg112e52@anurag.edu.in
* password:Test@1234

# IF U WANT TO TEST PRODUCTS LOGIN AS ADMIN AND APPROVE YOUR PRODUCTS



## Features

### Authentication & Security

* JWT-based authentication
* Campus email verification using OTP
* Secure password hashing with bcrypt
* Protected routes using middleware
* Role-based access (User/Admin)

### Campus Verification

* College-specific registration
* Email domain validation
* Approved campus onboarding
* Campus-restricted marketplace access

### Marketplace

* Create item listings
* Upload images and videos
* Product approval workflow
* Category-based browsing
* Search and filtering
* Infinite scrolling and pagination

### Orders & Delivery

* Buy products from students
* Order management
* Delivery tracking
* Meetup location support
* Order acceptance and rejection

### Cart System

* Add to cart
* Update quantity
* Remove items
* Checkout support

### Communication

* Real-time buyer-seller messaging
* Conversation history
* Product-specific chats

### Notifications

* In-app notifications
* Order updates
* Stock alerts
* Help center notifications

### Discount System

* Coupon management
* Category-specific discounts
* Usage limits
* Expiry validation

### Help Center

* Feedback submission
* Query management
* Post-order dispute handling

## Tech Stack

### Frontend

* React.js
* React Router
* React Hook Form
* Axios
* Tailwind CSS

### Backend

* Node.js
* Express.js
* JWT Authentication
* Multer
* Busboy

### Database

* MongoDB Atlas
* Mongoose

### Cloud Services

* Cloudinary
* Brevo SMTP

## Project Structure

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── store/
│   ├── routes/
│   └── assets/

backend/
├── APIs/
├── models/
├── config/
├── middlewares/
├── Service/
└── server.js

## Environment Variables

Backend:

MONGO_URI=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
EMAIL_USER=
EMAIL_PASS=

## Installation

### Clone Repository

git clone <repository-url>

### Backend

cd backend
npm install
npm run dev

### Frontend

cd frontend
npm install
npm run dev

## Deployment

Frontend: Render / Vercel

Backend: Render

Database: MongoDB Atlas

Media Storage: Cloudinary

SMTP: Brevo

## Future Improvements

* Real-time notifications using Socket.IO
* Payment gateway integration
* Campus moderation dashboard
* Product recommendation engine
* AI-assisted search



## Author

Karthik

Final Year MERN Stack Project
