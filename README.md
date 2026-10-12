# CampusKart — Campus Buy & Sell Platform

CampusKart is a MERN marketplace for college communities. Students can list, discover, and buy items within verified campus communities.

## Features

- **Authentication:** JWT sessions, campus email OTP verification, password hashing, and role-based access.
- **Campus onboarding:** College email-domain validation and approved-campus management.
- **Marketplace:** Product listings, media uploads, approval workflows, search, filters, and pagination.
- **Orders and delivery:** Buyer/seller order management, meetup details, and delivery tracking.
- **Cart and discounts:** Cart management, checkout flow, coupon limits, and expiry validation.
- **Communication:** Buyer/seller conversations and in-app notifications.
- **Support:** Feedback, help queries, and order-dispute workflows.

## Tech stack

- **Frontend:** React, React Router, Axios, Zustand, Tailwind CSS, Bootstrap, Vite
- **Backend:** Node.js, Express, JWT, Multer, Nodemailer, Cloudinary
- **Database:** MongoDB Atlas with Mongoose
- **Services:** Cloudinary media storage and Brevo SMTP

## Repository structure

```text
frontend/   React application
  src/
    components/
    store/
    assets/
backend/    Express API
  APIs/
  models/
  middlewares/
  config/
  Service/
  server.js
```

## Requirements

- Node.js compatible with the installed Vite and backend dependency versions
- npm
- MongoDB connection string
- Cloudinary credentials and SMTP credentials if those integrations are used

## Environment setup

Create a private `.env` file in `backend/` and set the values required by the backend:

```dotenv
PORT=5000
DB_URL=mongodb+srv://...
JWT_SECRET=replace-with-a-long-random-secret
CLOUD_NAME=
API_KEY=
API_SECRET=
EMAIL_USER=
EMAIL_PASS=
CLIENT_ORIGIN=https://individual-final-project-mern-stack.vercel.app
```

Use a locally generated random secret for `JWT_SECRET`. Never commit real credentials or share production environment files. Variable names must match the ones used by the code and the hosting environment.

## Run locally

Open two terminals from the repository root.

**Backend**

```bash
cd backend
npm install
npm run dev
```

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

Configure the frontend API base URLs for your local backend when needed. The deployed frontend origin can be changed with `CLIENT_ORIGIN`.

## Security notes

- Do not publish test-account passwords, access tokens, database URLs, API keys, or SMTP credentials.
- Rotate any credential that has ever been committed publicly; removing it from the latest version does not erase it from Git history.
- Create test accounts through the registration flow rather than relying on shared public credentials.
- Keep production secrets in the hosting provider's environment-variable settings.

## Author

Karthik — Final Year MERN Stack Project
