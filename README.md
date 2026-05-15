# 🛒 VISION.MART - AI-Powered E-Commerce Platform

### 📋 Project Overview

**VISION.MART** is a modern e-commerce platform with advanced AI technologies. It combines:

- **React SPA** for the Frontend
- **Laravel REST API** for the Backend
- **FastAPI + TensorFlow** for the AI Service
- **MySQL** as the Database

### ✨ Key Features

1. **Image Search:**
   - Upload an image and find similar products using TensorFlow
   - Extract image embeddings
   - Calculate similarity using Cosine Similarity

2. **Automatic Category Classification:**
   - Classify images to product categories
   - Display confidence score

3. **Store Management:**
   - Admin dashboard
   - Seller dashboard
   - Shopping cart and wishlist
   - Order management

4. **Authentication & Security:**
   - Token-based authentication (Sanctum)
   - Role-based access control (RBAC)
   - Input validation

---

## 🚀 Quick Start

### Prerequisites
Ensure you have installed:
- **Node.js** v16+ (Frontend)
- **PHP** 8.3+ (Backend)
- **Composer** 2.0+ (PHP dependency manager)
- **Python** 3.10+ (AI Service)
- **MySQL** 8.0+ (Database)

### Quick Start Guide

#### **1. Setup Backend (Laravel)**

**Windows:**
```cmd
cd backEnd\finalProject
composer install
copy .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
REM Runs on: http://localhost:8000
```

**Linux/Mac:**
```bash
cd backEnd/finalProject
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
# Runs on: http://localhost:8000
```

#### **2. Setup Frontend (React)**

**Windows:**
```cmd
cd frontEnd\visionmart
npm install
npm start
REM Opens: http://localhost:3000
```

**Linux/Mac:**
```bash
cd frontEnd/visionmart
npm install
npm start
# Opens: http://localhost:3000
```

#### **3. Setup AI Service (FastAPI)**

**Windows:**
```cmd
cd backEnd\AI-services
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
REM Runs on: http://localhost:8001
```

**Linux/Mac:**
```bash
cd backEnd/AI-services
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
# Runs on: http://localhost:8001
```

#### **4. Run All Services Simultaneously (Optional)**

**Windows (PowerShell - Open 3 separate terminals):**
```powershell
# Terminal 1 - Backend
cd backEnd\finalProject
php artisan serve

# Terminal 2 - Frontend
cd frontEnd\visionmart
npm start

# Terminal 3 - AI Service
cd backEnd\AI-services
python -m venv venv
venv\Scripts\activate
uvicorn main:app --reload --port 8001
```

**Linux/Mac (Open 3 separate terminals):**
```bash
# Terminal 1 - Backend
cd backEnd/finalProject
php artisan serve

# Terminal 2 - Frontend
cd frontEnd/visionmart
npm start

# Terminal 3 - AI Service
cd backEnd/AI-services
source venv/bin/activate
uvicorn main:app --reload --port 8001
```

---

## 🔗 Main API Endpoints

### Public
```
GET    /api/products
GET    /api/categories
POST   /api/login
POST   /api/register
POST   /api/ai/search
```

### Admin
```
GET    /api/admin/products
GET    /api/admin/sellers
GET    /api/admin/customers
```

### Seller
```
GET    /api/seller/products
POST   /api/seller/products
PUT    /api/seller/products/{id}
DELETE /api/seller/products/{id}
```

### Customer
```
GET    /api/cart
GET    /api/wishlist
GET    /api/orders
POST   /api/orders
```

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 18, React Router v6, Bootstrap 5, FontAwesome |
| Backend | Laravel 13, PHP 8.3, Sanctum, Eloquent ORM |
| AI | FastAPI, TensorFlow, Keras, scikit-learn |
| Database | MySQL 8.0 |
| Tools | Composer, npm, Python, PyMySQL |

---

## 🧪 Testing Image Search

### Via FastAPI Interactive Docs:
1. Visit: `http://localhost:8001/docs`
2. Find the `/predict-category` endpoint
3. Click "Try it out"
4. Upload a product image and test it

### Via Frontend UI:
1. Go to homepage
2. Click the camera icon in the search bar
3. Upload a product image
4. View results and predicted category

---

## 📊 Database Schema

**Main Tables:**
- **users** - User accounts (customers, sellers, admins)
- **products** - Product listings
- **categories** - Product categories
- **cart_items** - Shopping cart items
- **wishlist_items** - Wishlist items
- **orders** - Customer orders
- **order_items** - Order line items
- **ai_predictions** - AI prediction history

---

## 🔐 Authentication & Authorization

**User Roles:**
1. **Admin** - Full platform control
2. **Seller** - Manage own products
3. **Customer** - Browse and purchase products

**Auth Flow:**
1. User registers or logs in
2. Server returns Bearer token
3. Token stored in localStorage
4. All requests include: `Authorization: Bearer {token}` header

---

## 🚨 Troubleshooting

**"Connection refused" on port 8000?**
```bash
# Make sure Laravel is running
php artisan serve
```

**"Cannot find module" in React?**
```bash
cd frontEnd\visionmart  (Windows) or cd frontEnd/visionmart (Linux/Mac)
npm install
npm start
```

**"ModuleNotFoundError" in Python?**
```bash
# Windows
venv\Scripts\activate
pip install -r requirements.txt

# Linux/Mac
source venv/bin/activate
pip install -r requirements.txt
```

**MySQL connection error?**
- Ensure MySQL server is running
- Verify database credentials in `.env`
- Check DB_HOST, DB_USERNAME, DB_PASSWORD

---

## 📝 Development Notes

**API Base URLs:**
- Laravel Backend: `http://127.0.0.1:8000/api`
- FastAPI AI Service: `http://127.0.0.1:8001`
- Frontend: `http://localhost:3000`

**Image Storage:**
- Product images stored in: `backEnd/finalProject/storage/app/public`
- Access via: `http://127.0.0.1:8000/storage/{path}`

**AI Model:**
- Pre-trained model: `product_classifier_v2.keras`
- Location: `backEnd/AI-services/`
- Built with TensorFlow/Keras

**Architecture Highlights:**
- Decoupled frontend-backend separation
- Centralized API client in React (`api.js`)
- Batched image processing for performance
- Cosine similarity for image matching
- Role-based middleware for security

---

## 🤝 Contributing

This is a graduation project but can be enhanced with:
- Unit and integration tests
- Performance optimizations
- Additional features
- Multi-language support
- Docker containerization

---

## 📄 License

This project is open-source and available for educational use.

---

## 👤 Author

Ahmed Mahmoud Attia

---

**Last Updated:** May 2026  
**Project Status:** ✅ Complete & Deployed  
**Repository:** https://github.com/A7medDawam/VISION.MART
