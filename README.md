# Pizza Delivery Application

A full-stack MERN application for custom pizza ordering with real-time order tracking, mock payment integration, automated email notifications, and a complete admin management dashboard.

Built as part of the **Oasis Infobyte Web Development & Design Internship (Level 3)**.

## Live Demo

- **Frontend:** https://pizza-delivery-app-lovat.vercel.app
- **Backend API:** https://pizza-delivery-backend-wyh7.onrender.com

> Note: The backend is hosted on Render's free tier and may take 30-60 seconds to wake up after periods of inactivity. Please be patient on the first request.

## Features

### User Features

- **Authentication:** Secure registration with bcrypt password hashing and JWT-based sessions
- **Email Verification:** Account verification via email link (Nodemailer + Gmail SMTP)
- **Password Reset:** Forgot password flow with secure tokens
- **Custom Pizza Builder:** 6-step interactive flow with live pizza visualization
  - 5 Bases (Thin Crust, Pan Crust, Stuffed Crust, Whole Wheat, Gluten Free)
  - 5 Sauces (Classic Tomato, Pesto, BBQ, White Garlic, Spicy Marinara)
  - Multiple Cheeses (Mozzarella, Cheddar, Parmesan, Feta, Vegan)
  - Veggies (Mushrooms, Onions, Bell Peppers, Olives, Tomatoes, Jalapenos, Spinach, Corn)
  - Meats (Pepperoni, Chicken, Beef, Bacon, Sausage)
- **Mock Payment Flow:** Razorpay-style payment modal with simulated processing
- **Order History:** View all past orders with status tracking
- **Real-Time Updates:** Live order status changes pushed via Socket.io websockets

### Admin Features

- **Dedicated Admin Panel:** Separate dashboard with role-based routing
- **Dashboard Overview:** Total orders, revenue, customers, low-stock alerts
- **Order Management:** View all orders, update status (Order Received -> In the Kitchen -> Sent to Delivery -> Delivered)
- **Inventory Management:** Color-coded stock indicators (green/yellow/red), inline stock editing
- **Real-Time Status Push:** Status changes instantly notify the user via websocket
- **Automated Email Alerts:** Low-stock notifications sent automatically when ingredients drop below threshold

## Tech Stack

### Frontend

- **React 18** with Vite for fast development
- **Tailwind CSS v4** for styling
- **Redux Toolkit** for state management with localStorage persistence
- **React Router v7** for routing with protected routes
- **Axios** with JWT interceptors for API calls
- **Socket.io-client** for real-time updates
- **React Hot Toast** for notifications

### Backend

- **Node.js + Express** REST API
- **MongoDB + Mongoose** for data persistence
- **JWT (jsonwebtoken)** for authentication
- **bcryptjs** for password hashing
- **Socket.io** for real-time communication
- **Nodemailer** for transactional emails
- **express-validator** for input validation
- **CORS** configured for cross-origin requests

### Deployment

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas (cloud)

## Project Structure

Level3_Pizza_Delivery_App/
├── backend/
│ ├── config/
│ │ └── db.js # MongoDB connection
│ ├── controllers/ # Route handlers
│ │ ├── adminController.js
│ │ ├── authController.js
│ │ ├── ingredientController.js
│ │ └── orderController.js
│ ├── middleware/
│ │ └── authMiddleware.js # JWT protect + admin role check
│ ├── models/ # Mongoose schemas
│ │ ├── Ingredient.js
│ │ ├── Order.js
│ │ └── User.js
│ ├── routes/ # Express routers
│ │ ├── adminRoutes.js
│ │ ├── authRoutes.js
│ │ ├── ingredientRoutes.js
│ │ └── orderRoutes.js
│ ├── seeders/
│ │ └── seedIngredients.js # Seed 28 ingredients
│ ├── utils/ # Helpers
│ │ ├── emailTemplates.js
│ │ ├── generateToken.js
│ │ └── sendEmail.js
│ ├── .env # Environment variables (not in repo)
│ ├── package.json
│ └── server.js # Express + Socket.io entry
└── frontend/
├── src/
│ ├── components/
│ │ ├── AdminRoute.jsx # Admin-only route guard
│ │ ├── PaymentModal.jsx # Razorpay-style mock payment
│ │ └── PizzaPreview.jsx # Live pizza visualization
│ ├── pages/
│ │ ├── AdminDashboard.jsx
│ │ ├── Dashboard.jsx
│ │ ├── Login.jsx
│ │ ├── MyOrders.jsx
│ │ ├── PizzaBuilder.jsx
│ │ └── Register.jsx
│ ├── store/ # Redux Toolkit
│ │ ├── authSlice.js
│ │ └── index.js
│ ├── utils/
│ │ ├── api.js # Axios + JWT interceptor
│ │ └── socket.js # Socket.io client
│ ├── App.jsx # Routes with ProtectedRoute + AdminRoute
│ ├── main.jsx
│ └── index.css
├── package.json
└── vite.config.js

## Local Setup Instructions

### Prerequisites

- Node.js v18 or higher
- MongoDB (local installation or Atlas)
- A Gmail account with App Password (for email features)

### Backend Setup

cd Level3_Pizza_Delivery_App/backend
npm install

Create a `.env` file in the `backend/` directory:
PORT=5000
MONGO_URI=mongodb://localhost:27017/pizzaApp
JWT_SECRET=your_jwt_secret_here
NODE_ENV=development
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_FROM=Pizza Delivery your_email@gmail.com
CLIENT_URL=http://localhost:5173
Seed the database with ingredients:
node seeders/seedIngredients.js

Start the backend:
npm run dev
node seeders/seedIngredients.js

Start the backend:
npm run dev
The backend runs on `http://localhost:5000`.

### Frontend Setup

cd Level3_Pizza_Delivery_App/frontend
npm install
npm run dev
The frontend runs on `http://localhost:5173`.

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user (set role: "admin" in body for admin)
- `POST /api/auth/login` - Login
- `GET /api/auth/verify-email/:token` - Verify email
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password
- `GET /api/auth/profile` - Get current user (protected)

### Ingredients

- `GET /api/ingredients` - Get all ingredients grouped by category (protected)

### Orders

- `POST /api/orders` - Create new order (protected)
- `GET /api/orders/my-orders` - Get logged-in user's orders (protected)
- `GET /api/orders/:id` - Get single order (protected)
- `PUT /api/orders/:id/confirm-payment` - Confirm payment (protected)

### Admin

- `GET /api/admin/stats` - Dashboard statistics (admin only)
- `GET /api/admin/orders` - All orders (admin only)
- `PUT /api/admin/orders/:id/status` - Update order status (admin only)
- `GET /api/admin/inventory` - All ingredients with details (admin only)
- `PUT /api/admin/inventory/:id` - Update ingredient stock/price (admin only)

## Real-Time Communication

The application uses Socket.io for real-time order status updates:

1. When a user opens "My Orders" page, the frontend connects to the socket server
2. The user joins a room identified by their user ID
3. When admin updates an order's status, the backend emits `orderStatusUpdate` to that user's room
4. The user's UI updates instantly (toast notification + status badge change) without refresh

## Payment Integration

Per the task requirements, this project includes a Razorpay-style payment integration:

- A custom payment modal mimics the Razorpay checkout UI
- Pre-filled test card details are displayed (4111 1111 1111 1111)
- "Pay" button simulates payment processing with realistic delays
- On success, a unique payment ID is generated and the order is confirmed with `paymentStatus: "Paid"`
- This implementation honors the spec: "In test mode, on clicking success, place and confirm the order."

> Note: Razorpay's signup requires Indian regional access which was unavailable during development. The mock implementation faithfully reproduces the Razorpay UI and click-success flow.

## Known Limitations

- **Render free tier sleep:** The backend may take 30-60 seconds to wake up after 15 minutes of inactivity. Subsequent requests are fast.
- **Email delivery on production:** Email functionality (verification, password reset, low-stock alerts) is fully implemented with Nodemailer + Gmail SMTP and works perfectly in local development. Render's free tier has known SMTP limitations; a dedicated service like SendGrid or Resend would be used in a real production deployment.

## Project Requirements Coverage

All 10 task requirements have been implemented:

1. Admin and user authentication with registration, email verification, and password reset
2. Users view pizza varieties on the dashboard
   3-4. Custom pizza flow with multiple bases, sauces, cheese, and veggies
3. Razorpay-style payment integration in test mode
4. Admin inventory management
5. Stock auto-deducts on order placement
6. Email admin when stock drops below threshold
7. Admin updates order status (Order Received -> In the Kitchen -> Sent to Delivery -> Delivered)
8. Real-time status updates reflect in user dashboard via Socket.io

## Author

**Liana Jomaa**

- GitHub: [@lianajomaa95-blip](https://github.com/lianajomaa95-blip)
- Email: lianajomaa95@gmail.com

## Acknowledgments

Thanks to **Oasis Infobyte** for the internship opportunity and AICTE for facilitating the program.

#oasisinfobyte #internship #webdevelopment #fullstack #MERN
