
📁 GOGO E-Commerce Project - Complete Folder Structure

## 🌳 Root Directory Structure

```
GOGO-ecommerce-Next.js/
├── 📁 admin/                          # Admin Dashboard (Next.js)
├── 📁 client/                         # Client Application (Next.js)
├── 📁 server/                         # Backend API (Express.js)
├── 📁 node_modules/                   # Root dependencies
├── 📁 .git/                           # Git repository
├── 📄 package.json                    # Root package config
├── 📄 package-lock.json               # Root lock file
├── 📄 .gitignore                      # Git ignore rules
├── 📄 .gitattributes                  # Git attributes
├── 📄 JWT_AND_CODE_VERIFICATION.md    # JWT implementation doc
└── 📄 FOLDER_STRUCTURE.md             # This file
```

---

## 🛡️ Admin Dashboard (`/admin`)

```
admin/
├── 📁 src/                            # Source files
│   ├── 📁 app/                        # Next.js app directory
│   │   ├── 📁 (dashboard)/            # Protected dashboard routes
│   │   │   └── 📄 layout.jsx          # Dashboard layout with auth
│   │   │
│   │   ├── 📁 admin-login/            # Admin login page
│   │   │   └── 📄 page.jsx            # Login form with JWT
│   │   │
│   │   ├── 📁 addproduct/             # Add product page
│   │   │   └── 📄 page.jsx            # Product form
│   │   │
│   │   ├── 📁 editproduct/            # Edit product page
│   │   │   ├── 📁 [productId]/        # Dynamic route
│   │   │   │   └── 📄 page.jsx        # Edit form
│   │   │   └── 📄 page.jsx            
│   │   │
│   │   ├── 📁 products/               # Products management
│   │   │   └── 📄 page.jsx            # Products list
│   │   │
│   │   ├── 📁 users/                  # Users management
│   │   │   └── 📄 page.jsx            # Users table with avatars
│   │   │
│   │   ├── 📁 orders/                 # Orders management
│   │   │   └── 📄 page.jsx            # Orders list
│   │   │
│   │   ├── 📁 slider/                 # Slider management
│   │   │   └── 📄 page.jsx            # Home slider editor
│   │   │
│   │   ├── 📁 setting/                # Settings page
│   │   │   └── 📄 page.jsx            # Admin settings
│   │   │
│   │   ├── 📁 login/                  # Fallback login
│   │   │   └── 📄 page.jsx            # Login page
│   │   │
│   │   ├── 📁 logout/                 # Logout page
│   │   │   └── 📄 page.jsx            # Logout logic
│   │   │
│   │   ├── 📁 components/             # Reusable components
│   │   │   ├── 📄 Dheader.jsx         # Dashboard header
│   │   │   ├── 📄 Dsidebar.jsx        # Dashboard sidebar
│   │   │   ├── 📁 Dasboard/           # Dashboard components
│   │   │   └── 📁 Products/           # Product components
│   │   │
│   │   ├── 📁 api/                    # API routes
│   │   │   ├── 📁 products/           # Products API endpoints
│   │   │   └── ...                    # Other API routes
│   │   │
│   │   ├── 📄 page.js                 # Root page
│   │   ├── 📄 layout.js               # Root layout
│   │   ├── 📄 globals.css             # Global styles
│   │   ├── 📄 favicon.ico             # Favicon
│   │   └── 📁 utils/                  # Utility functions
│   │       └── 📄 api.js              # API utilities
│   │
│   └── 📁 utils/                      # Global utilities
│       ├── 📄 api.js                  # JWT token management
│       └── 📄 useAuth.js              # Auth custom hook
│
├── 📁 public/                         # Static assets
│   └── ...                            # Images, icons, etc.
│
├── 📁 node_modules/                   # Dependencies
├── 📄 .env.example                    # Environment variables template
├── 📄 .gitignore                      # Git ignore rules
├── 📄 package.json                    # Dependencies & scripts
├── 📄 package-lock.json               # Locked versions
├── 📄 next.config.mjs                 # Next.js configuration
├── 📄 jsconfig.json                   # JS path aliases
├── 📄 postcss.config.mjs              # Tailwind CSS config
├── 📄 eslint.config.mjs               # ESLint rules
├── 📄 middleware.js                   # Route protection middleware
├── 📄 README.md                       # Project info
├── 📄 AGENTS.md                       # AI agent config
├── 📄 CLAUDE.md                       # Claude instructions
├── 📄 JWT_SECURITY.md                 # JWT security docs
└── 📄 .next/                          # Build output
```

---

## 🛍️ Client Application (`/client`)

```
client/
├── 📁 src/                            # Source files
│   ├── 📁 app/                        # Next.js app directory
│   │   ├── 📁 components/             # UI components
│   │   │   ├── 📄 Header.jsx          # Header with auth menu
│   │   │   ├── 📄 Nav.jsx             # Navigation bar
│   │   │   ├── 📄 Search.jsx          # Search box
│   │   │   ├── 📄 Sidebar.jsx         # Product filters
│   │   │   ├── 📄 Footer.jsx          # Footer with newsletter
│   │   │   ├── 📄 Banner.jsx          # Hero banner
│   │   │   ├── 📄 Catslider.jsx       # Category carousel
│   │   │   ├── 📄 Homeslider.jsx      # Home slider
│   │   │   ├── 📄 Productitem.jsx     # Product card
│   │   │   ├── 📄 Productrow.jsx      # Product row
│   │   │   ├── 📄 Productslider.jsx   # Product carousel
│   │   │   ├── 📄 Propularproduct.jsx # Popular products
│   │   │   └── 📄 Dasboard/           # Dashboard components
│   │   │
│   │   ├── 📁 pages/                  # Page routes
│   │   │   ├── 📄 page.js             # 🏠 Home page
│   │   │   │
│   │   │   ├── 📁 products/           # 📱 Products page
│   │   │   │   ├── 📄 page.jsx        # Products list with filters
│   │   │   │   └── 📁 utils/          # Product utilities
│   │   │   │
│   │   │   ├── 📁 cart/               # 🛒 Shopping cart
│   │   │   │   └── 📄 page.jsx        # Cart items display
│   │   │   │
│   │   │   ├── 📁 checkout/           # 💳 Checkout page
│   │   │   │   └── 📄 page.jsx        # Payment & address form
│   │   │   │
│   │   │   ├── 📁 wishlist/           # ❤️ Wishlist page
│   │   │   │   └── 📄 page.jsx        # Saved items
│   │   │   │
│   │   │   ├── 📁 productdet/         # Product details
│   │   │   │   ├── 📁 [productdetId]/ # Dynamic route
│   │   │   │   │   └── 📄 page.jsx    # Product detail page
│   │   │   │   └── 📄 page.jsx
│   │   │   │
│   │   │   ├── 📁 login/              # 🔑 Login page
│   │   │   │   └── 📄 page.jsx        # Email/password login
│   │   │   │
│   │   │   ├── 📁 register/           # 📝 Register page
│   │   │   │   └── 📄 page.jsx        # User registration form
│   │   │   │
│   │   │   ├── 📁 verify/             # Email verification
│   │   │   │   └── 📄 page.jsx        # OTP verification
│   │   │   │
│   │   │   ├── 📁 forgot-password/    # Password recovery
│   │   │   │   └── 📄 page.jsx        # Password reset form
│   │   │   │
│   │   │   ├── 📄 layout.js           # Root layout
│   │   │   ├── 📄 globals.css         # Global styles
│   │   │   ├── 📄 favicon.ico         # Favicon
│   │   │   └── 📁 utils/              # Utilities
│   │   │       └── 📄 api.js          # API calls
│   │   │
│   │   └── 📁 middleware/             # Next.js middleware
│   │
│   ├── 📁 context/                    # React Context (State Management)
│   │   ├── 📄 AuthContext.jsx         # 🔐 JWT + Auth state
│   │   ├── 📄 CartContext.jsx         # 🛒 Shopping cart state
│   │   ├── 📄 WishlistContext.jsx     # ❤️ Wishlist state
│   │   ├── 📄 ThemeContext.jsx        # 🎨 Theme state
│   │   └── 📄 ThemeProvider.jsx       # Theme provider
│   │
│   ├── 📁 utils/                      # Global utilities
│   │   └── 📄 api.js                  # 🔐 JWT + API functions
│   │
│   ├── 📄 firebase.js                 # Firebase configuration
│   └── 📄 constants.js                # Constants & config values
│
├── 📁 public/                         # Static assets
│   ├── 📄 c1.avif                     # Category image 1
│   ├── 📄 c2.avif                     # Category image 2
│   ├── 📄 gog.png                     # Logo
│   └── ...                            # Other assets
│
├── 📁 node_modules/                   # Dependencies
├── 📄 .env.example                    # Environment template
├── 📄 .gitignore                      # Git ignore rules
├── 📄 package.json                    # Dependencies & scripts
├── 📄 package-lock.json               # Locked versions
├── 📄 next.config.mjs                 # Next.js configuration
├── 📄 jsconfig.json                   # JS path aliases
├── 📄 postcss.config.mjs              # Tailwind CSS config
├── 📄 tailwind.config.js              # Tailwind configuration
├── 📄 eslint.config.mjs               # ESLint rules
├── 📄 middleware.js                   # Route middleware
├── 📄 README.md                       # Project info
├── 📄 AGENTS.md                       # AI agent config
├── 📄 CLAUDE.md                       # Claude instructions
└── 📄 .next/                          # Build output
```

---

## 🔧 Backend Server (`/server`)

```
server/
├── 📁 models/                         # Database schemas (Mongoose)
│   ├── 📄 user.model.js               # User schema
│   ├── 📄 product.model.js            # Product schema
│   ├── 📄 order.js                    # Order schema
│   ├── 📄 admin.model.js              # Admin schema
│   ├── 📄 address.model.js            # Address schema
│   └── 📄 homeSlider.moder.js         # Home slider schema
│
├── 📁 routes/                         # API route handlers
│   ├── 📄 user.route.js               # 🔐 Auth & user routes
│   │   ├── POST /login
│   │   ├── POST /register
│   │   ├── POST /authWithGoogle
│   │   ├── POST /refresh-token
│   │   ├── GET /:id
│   │   └── PUT /:id
│   │
│   ├── 📄 product.route.js            # 📦 Product routes
│   │   ├── GET /products
│   │   ├── POST /products
│   │   ├── PUT /products/:id
│   │   └── DELETE /products/:id
│   │
│   ├── 📄 order.route.js              # 📋 Order routes
│   │   ├── POST /orders
│   │   ├── GET /orders
│   │   └── GET /orders/:id
│   │
│   ├── 📄 admin.route.js              # 🛡️ Admin routes
│   │   └── Protected endpoints
│   │
│   └── 📄 homeSlider.route.js         # 🖼️ Slider routes
│
├── 📁 controllers/                    # Business logic
│   ├── 📄 user.controller.js          # User operations
│   ├── 📄 product.controller.js       # Product operations
│   ├── 📄 order.controller.js         # Order operations
│   ├── 📄 admin.controller.js         # Admin operations
│   └── 📄 homeSlider.controller.js    # Slider operations
│
├── 📁 middleware/                     # Express middleware
│   ├── 📄 auth.js                     # 🔐 JWT verification
│   ├── 📄 adminAuth.js                # Admin authorization
│   └── 📄 multer.js                   # File upload handling
│
├── 📁 config/                         # Configuration files
│   ├── 📄 connectDb.js                # 🗄️ MongoDB connection
│   ├── 📄 cloudinary.js               # ☁️ Cloudinary setup
│   ├── 📄 emailService.js             # 📧 Email service
│   ├── 📄 multerConfig.js             # File upload config
│   └── 📄 sendEmail.js                # Email sender utility
│
├── 📁 utils/                          # Utility functions
│   ├── 📄 generateAccessToken.js      # JWT access token
│   ├── 📄 generateRefreshToken.js     # JWT refresh token
│   └── 📄 verifyEmailTemplate.js      # Email templates
│
├── 📁 upload/                         # Uploaded files storage
│   └── 📁 sliders/                    # Slider images
│
├── 📁 node_modules/                   # Dependencies
├── 📄 .env                            # Environment variables
├── 📄 package.json                    # Dependencies & scripts
├── 📄 package-lock.json               # Locked versions
├── 📄 index.js                        # 🚀 Server entry point
└── 📄 README.md                       # Project info
```

---

## 📊 Key Files Overview

### Admin Dashboard
| File | Purpose | Type |
|------|---------|------|
| `admin-login/page.jsx` | Admin authentication | Page |
| `(dashboard)/layout.jsx` | Protected layout | Layout |
| `products/page.jsx` | Manage products | Page |
| `users/page.jsx` | Manage users | Page |
| `src/utils/api.js` | JWT token management | Util |
| `middleware.js` | Route protection | Middleware |

### Client Application
| File | Purpose | Type |
|------|---------|------|
| `components/Header.jsx` | Header with auth menu | Component |
| `components/Sidebar.jsx` | Product filters | Component |
| `products/page.jsx` | Products with filters | Page |
| `login/page.jsx` | User login form | Page |
| `register/page.jsx` | User registration | Page |
| `context/AuthContext.jsx` | Auth state & JWT | Context |
| `context/CartContext.jsx` | Shopping cart state | Context |
| `context/WishlistContext.jsx` | Wishlist state | Context |
| `utils/api.js` | JWT & API utilities | Util |

### Server
| File | Purpose | Type |
|------|---------|------|
| `index.js` | Server entry point | Server |
| `routes/user.route.js` | Auth endpoints | Routes |
| `controllers/user.controller.js` | Auth logic | Controller |
| `middleware/auth.js` | JWT verification | Middleware |
| `models/user.model.js` | User schema | Model |
| `config/connectDb.js` | MongoDB connection | Config |

---

## 🔐 JWT Security Files

### Authentication Implementation
```
Admin:
├── src/utils/api.js              # Token management
├── src/utils/useAuth.js          # Auth hook
├── middleware.js                 # Route protection
└── admin-login/page.jsx          # Login page

Client:
├── src/context/AuthContext.jsx   # Token validation & refresh
├── src/utils/api.js              # JWT injection & retry logic
├── login/page.jsx                # Login form
└── register/page.jsx             # Registration form

Server:
├── middleware/auth.js            # JWT verification
├── utils/generateAccessToken.js  # Token generation
├── utils/generateRefreshToken.js # Refresh token
├── routes/user.route.js          # Auth endpoints
└── controllers/user.controller.js # Auth logic
```

---

## 📦 Dependencies Structure

### Admin & Client (Next.js projects)
```
Dependencies:
├── Next.js 16.2.1
├── React 19.2.4
├── Tailwind CSS 4
├── React Icons
├── Firebase (Auth)
├── js-cookie (Token storage)
├── Lucide React (Icons)
├── Material-UI (Components)
└── Swiper (Carousels)
```

### Server (Node.js + Express)
```
Dependencies:
├── Express.js (API)
├── MongoDB & Mongoose (Database)
├── JWT (jsonwebtoken) (Auth)
├── Cloudinary (Image storage)
├── Multer (File upload)
├── Dotenv (Environment)
├── CORS (Cross-origin)
└── Email service (SendGrid/Nodemailer)
```

---

## 🗂️ File Count Summary

| Directory | Files | Type |
|-----------|-------|------|
| `/admin` | ~50+ | Next.js App |
| `/client` | ~80+ | Next.js App |
| `/server` | ~40+ | Express API |
| **Total** | **~170+** | **Full Stack** |

---

## 🚀 Quick Navigation

### To run projects:
```bash
# Admin Dashboard
cd admin && npm run dev        # Port 3000

# Client Application
cd client && npm run dev       # Port 3001

# Backend Server
cd server && npm start         # Port 8000
```

### Environment files needed:
```
admin/          → .env
client/         → .env.local
server/         → .env
```

---




<img width="1847" height="877" alt="Screenshot 2026-04-09 165924" src="https://github.com/user-attachments/assets/41040784-90df-4841-bce3-b79a9d794992" />







## 📊 **Diagram 1: Project Architecture**[1. Project Architecture Overview.html](https://github.com/user-attachments/files/26601695/1.Project.Architecture.Overview.html)

Shows the complete system architecture with:
- **Admin Dashboard** (🔐 Login, Products, Users, Orders, Sliders)
- **Client Application** (Home, Products, Cart, Checkout, Wishlist, Login/Register)
- **JWT Authentication** (Token System, AuthContext, Secure Cookies, Auto Refresh)
- **API Layer** (postData, API Functions, Error Handling)
- **Backend Services** (Routes, Controllers, MongoDB)
- **External Services** (Cloudinary, Email, OAuth)

---




<img width="1864" height="394" alt="Screenshot 2026-04-09 165943" src="https://github.com/user-attachments/assets/a8e73fe9-7775-486e-880e-f32d02a31814" />


## 📁 **Diagram 2: Folder Structure**
Shows the complete directory organization:
- **Admin/** (Login, Products, Users, Utils, Config)
- **Client/** (Pages, Components, Contexts, Utils)
- **Server/** (Models, Routes, Controllers, Middleware, Config)

Key files marked with icons showing their purpose (🔐 auth, 📱 pages, etc.)

---




<img width="1811" height="908" alt="Screenshot 2026-04-09 170048" src="https://github.com/user-attachments/assets/6c4ad7cd-d198-4381-ac15-2d46cd84a91a" />

## 🔄 **Diagram 3: Data Flow**
Shows how data flows through the entire application:
1. **User Interactions** → UI Components → Pages
2. **State Management** → React Contexts → Hooks
3. **API Communication** → JWT Token → HTTP Requests
4. **Backend Processing** → Routes → Controllers → Models
5. **Database** → MongoDB → Redis Cache
6. **External Services** → Cloudinary, Email, Google OAuth

**Special flows highlighted:**
- ✅ **Authentication Flow** (Login → Token Generation → Storage)
- ✅ **Token Refresh Flow** (401 Error → Refresh → Retry)

---




## 📋 **Project Summary**

| Component | Type | Purpose |
|-----------|------|---------|
| **Admin** | Next.js App | Dashboard for product & user management |
| **Client** | Next.js + React | E-commerce storefront with shopping features |
| **Server** | Express.js | REST API with JWT authentication |
| **Database** | MongoDB | Data persistence |
| **Auth** | JWT + Cookies | Secure token-based authentication |
| **Images** | Cloudinary | Image storage & CDN |
| **OAuth** | Firebase Auth | Google sign-up/login |

---

**Status: ✅ Production Ready** 🚀

The project has a clean, professional architecture with proper separation of concerns, secure JWT authentication, and all essential e-commerce features!
  
