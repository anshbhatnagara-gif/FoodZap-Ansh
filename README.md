# 🍕 FoodZap - Complete Food & Grocery Delivery Platform

A production-ready AI-powered food and grocery delivery platform combining features of Zomato, Swiggy, and Domino's.

## 🎯 Features

### User Features
- **AI Food Suggestions**: Get personalized food recommendations based on mood
- **Multi-category Ordering**: Food, Fast Food, Groceries
- **Smart Search**: Find restaurants, dishes, and groceries
- **Live Tracking**: Real-time order tracking on Google Maps
- **Multiple Payment Options**: UPI, Cards, Net Banking, COD
- **Order History & Favorites**: Save preferences for future orders

### Restaurant Features
- **Menu Management**: Add/edit food items with categories
- **Order Management**: Accept/reject orders
- **Analytics Dashboard**: Track sales and performance

### Delivery Partner Features
- **Order Acceptance**: Accept/reject delivery requests
- **Earnings Dashboard**: Track daily/weekly earnings
- **Route Optimization**: GPS-based delivery routes

### Admin Features
- **User Management**: Manage customers, restaurants, delivery partners
- **Analytics**: Platform-wide statistics
- **Content Moderation**: Reviews and ratings management

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                             │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ │
│  │  Home   │ │Restaurant│ │  Cart   │ │ Profile │ │ Tracking│ │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Backend (Node.js)                      │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐          │
│  │  Auth   │ │ Restaurant│ │  Order  │ │ Payment │          │
│  │  API    │ │   API   │ │   API   │ │   API   │          │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘          │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐          │
│  │   AI    │ │  Maps   │ │ WebSocket│ │  Admin  │          │
│  │ Service │ │ Service │ │  Service │ │  Panel  │          │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Database (MongoDB)                       │
│  Users │ Restaurants │ Orders │ MenuItems │ Reviews │ Payments │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
food-delivery-platform/
├── backend/
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Authentication & validation
│   ├── services/        # Business logic
│   ├── utils/           # Helper functions
│   ├── websocket/       # Real-time services
│   └── server.js        # Entry point
├── frontend/
│   ├── css/             # Stylesheets
│   ├── js/              # JavaScript files
│   ├── pages/           # HTML pages
│   └── assets/          # Images & icons
└── docs/                # Documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB
- Google Maps API Key
- Gemini/OpenAI API Key

### Installation

1. **Clone and navigate**
```bash
cd food-delivery-platform
```

2. **Install Backend Dependencies**
```bash
cd backend
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ../frontend
npm install
```

4. **Environment Variables**
Create `.env` in backend folder:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/foodzap
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_MAPS_API_KEY=your_maps_api_key
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

5. **Start the Application**
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend (if using live server)
cd frontend
npx live-server --port=3000
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/google` - Google OAuth
- `POST /api/auth/otp/send` - Send OTP
- `POST /api/auth/otp/verify` - Verify OTP

### Restaurants
- `GET /api/restaurants` - List all restaurants
- `GET /api/restaurants/:id` - Get restaurant details
- `GET /api/restaurants/nearby` - Find nearby restaurants
- `GET /api/restaurants/:id/menu` - Get restaurant menu

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status
- `GET /api/orders/:id/track` - Track order location

### AI
- `POST /api/ai/suggest` - Get food suggestions based on mood
- `POST /api/ai/chat` - Chat with AI assistant

### Cart
- `GET /api/cart` - Get cart items
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update quantity
- `DELETE /api/cart/remove/:id` - Remove item

## 🗄️ Database Schema

See `docs/database-schema.md` for complete schema documentation.

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on APIs
- Input validation & sanitization
- CORS configuration
- Secure payment integration

## 📱 Responsive Design

The platform is fully responsive and works on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

MIT License - see LICENSE file

---
Built with ❤️ for food lovers everywhere!
