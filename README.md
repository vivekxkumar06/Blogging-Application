# BuildNotes — Professional Full-Stack MERN Editorial Blogging Platform

Inspired by [BuildNotes-MERN-Blog-Application](https://github.com/Saurabhtbj1201/BuildNotes-MERN-Blog-Application), this is a complete, modern, commercial-grade full-stack blogging platform. Engineered with the **MERN** stack (MongoDB, Express, React, Node.js), Tailwind CSS, Framer Motion, and the Tiptap rich-text editor.

---

## 🚀 Key Features

### 1. 🎨 Modern Editorial UI & UX Design
- **Editorial Typography**: Styled with *Newsreader* serif for immersive reading and *Plus Jakarta Sans* for clean UI clarity.
- **Micro-Interactions**: Powered by Framer Motion and Lucide React icons.
- **Adaptive Layout**: Fully responsive across mobile, tablet, and desktop viewports.
- **Loading Skeletons & Empty States**: Polished feedback states with zero layout shift.
- **Custom Toast System**: Toast alerts for authentication, bookmarks, likes, and moderation.

### 2. 🔐 Complete Authentication & Authorization
- **JWT & bcrypt.js**: Industry-standard authentication with salted password hashing.
- **Role-Based Access Control (RBAC)**: Distinguishes between `user` and `admin` permissions.
- **Protected Routes**: Restricts creation, editing, and bookmarking to authenticated sessions.
- **Admin Guard**: Restricts management dashboards to verified administrators.
- **Demo Quick-Fill**: One-click demo credentials for Admin and Author testing on the login screen.

### 3. ✍️ Blog Management & Tiptap Rich Editor
- **Rich-Text Editor**: Built with **Tiptap** supporting bold, italic, strikethrough, inline code, headers (H1, H2, H3), bullet/ordered lists, blockquotes, code blocks, hyperlinks, and image embedding.
- **Image Uploads**: Cloudinary integration with automatic fallback to high-resolution Unsplash stock previews.
- **Taxonomy**: Categories with custom color branding and tag filtering.
- **Drafts & Publishing**: Save in-progress drafts or publish immediately.
- **Ownership Verification**: Authors can only modify and delete their own posts (while admins have universal moderation capability).

### 4. 📖 Article Reading Experience
- **Hero Cover Image**: High-res featured imagery with reading time and view count badges.
- **Interactive Engagement**: Live Like/Unlike count, Bookmark/Save to reading list, and Share modal (Twitter, LinkedIn, Facebook, WhatsApp, Clipboard).
- **Threaded Commenting System**: Top-level responses and nested author replies.
- **Author Bio Card**: Inline author details with instant Follow/Unfollow toggle.
- **Contextual Related Articles**: Dynamically recommendations based on matching categories.

### 5. 👤 Author Profiles
- **Public Profile View**: Avatar, bio, social links (Website, Twitter, GitHub, LinkedIn), published articles list, and follower/following counters.
- **Profile Customization Modal**: Real-time bio, avatar, and social handle updates.

### 6. 🛡️ Admin Command Dashboard
- **Telemetry Cards**: Live metrics for Total Users, Total Articles, Published Stories, Drafts, Comments, and Cumulative Page Views.
- **Category Analytics**: Distribution breakdown chart across content verticals.
- **User Management**: Search, filter by role, toggle administrator status, and delete accounts.
- **Article Moderation**: Search, status filter, feature/unfeature toggle, view live, and delete articles.
- **Comment Moderation**: Threaded comments list with story links and delete capabilities.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite 5, Tailwind CSS, Framer Motion, Lucide React, Axios, date-fns |
| **Rich Text Editor** | Tiptap (`@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-link`, `@tiptap/extension-image`) |
| **Backend** | Node.js, Express.js 4, RESTful API architecture |
| **Database** | MongoDB with Mongoose ODM (indexed schemas, relations, and aggregations) |
| **Authentication** | JSON Web Tokens (JWT), bcryptjs |
| **File Storage** | Cloudinary API + Multer memory storage |

---

## 📁 Project Architecture

```
Blogging Application/
├── backend/
│   ├── config/
│   │   ├── db.js                 # MongoDB connection handler
│   │   └── cloudinary.js         # Cloudinary configuration & helpers
│   ├── controllers/
│   │   ├── adminController.js     # Analytics, user & blog moderation
│   │   ├── authController.js      # Register, login, profile, password
│   │   ├── blogController.js      # CRUD, likes, views, related
│   │   ├── bookmarkController.js  # Reading list bookmarks
│   │   ├── categoryController.js  # Taxonomy categories
│   │   ├── commentController.js   # Threaded comments & replies
│   │   ├── newsletterController.js# Email subscription
│   │   └── userController.js      # Author profile & follow logic
│   ├── middleware/
│   │   ├── authMiddleware.js      # protect, adminOnly, optionalAuth
│   │   └── errorMiddleware.js     # 404 & centralized error handler
│   ├── models/
│   │   ├── Blog.js                # Article schema with auto-slug & reading time
│   │   ├── Bookmark.js            # User bookmark compound index
│   │   ├── Category.js            # Categories schema with slugify
│   │   ├── Comment.js             # Nested threaded comment schema
│   │   ├── Newsletter.js          # Newsletter subscriber schema
│   │   └── User.js                # User schema with bcrypt password hashing
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── blogRoutes.js
│   │   ├── bookmarkRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── commentRoutes.js
│   │   ├── newsletterRoutes.js
│   │   ├── uploadRoutes.js
│   │   └── userRoutes.js
│   ├── utils/
│   │   └── generateToken.js       # JWT signing utility
│   ├── seed.js                    # Comprehensive database seeder
│   ├── server.js                  # Express API server entry point
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/             # StatsCards, UserTable, BlogTable, CommentTable
│   │   │   ├── blog/              # BlogCard, RichTextEditor, CommentSection, ShareModal
│   │   │   ├── common/            # Navbar, Footer, Modal, Skeleton, EmptyState
│   │   │   └── home/              # HeroSection, CategoryBar, TrendingSection, AuthorsSection, NewsletterSection
│   │   ├── context/
│   │   │   ├── AuthContext.jsx    # Persistent auth state & login/register handlers
│   │   │   └── ToastContext.jsx   # Animated toast notification system
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx # Admin management portal
│   │   │   ├── AuthorProfile.jsx  # Public author portfolio & edit modal
│   │   │   ├── BlogDetails.jsx    # Full article view & comment threads
│   │   │   ├── Bookmarks.jsx      # Saved reading list
│   │   │   ├── CreateEditBlog.jsx # Tiptap article writer/editor
│   │   │   ├── Home.jsx           # Editorial landing page
│   │   │   ├── Login.jsx          # Login screen with quick-fill
│   │   │   ├── NotFound.jsx       # 404 Error page
│   │   │   ├── Register.jsx       # Registration screen
│   │   │   └── Search.jsx         # Global discovery, filters & tags
│   │   ├── services/
│   │   │   └── api.js             # Axios instance with interceptors
│   │   ├── App.jsx                # Router & Route guards
│   │   ├── index.css              # Tailwind & Editorial typography
│   │   └── main.jsx               # React entry point
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── package.json                   # Root workspace scripts
├── .env.example                   # Root environment template
└── README.md
```

---

## ⚡ Installation & Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or v20+ recommended)
- [MongoDB](https://www.mongodb.com/) (running locally on port `27017` or a MongoDB Atlas URI)

### 1. Clone & Enter the Directory
```bash
cd "c:/Users/anand/OneDrive/Desktop/Blogging Application"
```

### 2. Configure Environment Variables
Copy `.env.example` in `backend/` to `backend/.env`:
```bash
cp backend/.env.example backend/.env
```

Ensure `backend/.env` has:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/buildnotes_blog
JWT_SECRET=buildnotes_super_secure_jwt_secret_key_2026
CLIENT_URL=http://localhost:5173

# Optional Cloudinary Credentials (fallback provided)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### 3. Populate Database with Demo Data
Run the database seed script to populate realistic articles, users, categories, comments, and stats:
```bash
cd backend
npm run seed
```

---

## 🖥️ How to Run the Application

### Option A: Run Backend & Frontend in Two Terminals

**Terminal 1 (Backend API):**
```bash
cd backend
npm run dev
# Server will run on: http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```bash
cd frontend
npm run dev
# Client will run on: http://localhost:5173
```

Now open **`http://localhost:5173`** in your browser!

---

## 🔑 Demo Accounts

The database seeder comes pre-configured with accounts. You can also click the **"Quick Demo Accounts"** buttons on the login page for instant sign-in:

| Role | Email | Password |
|---|---|---|
| **Administrator** | `admin@buildnotes.dev` | `AdminPassword123!` |
| **Author (Sarah)** | `sarah@buildnotes.dev` | `Password123!` |
| **Author (Alex)** | `alex@buildnotes.dev` | `Password123!` |

---

## 📡 REST API Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new account
- `POST /api/auth/login` — Sign in and receive JWT token
- `GET  /api/auth/me` — Get current logged-in profile (Protected)
- `PUT  /api/auth/profile` — Update user details and social links (Protected)
- `PUT  /api/auth/change-password` — Change account password (Protected)

### Articles (`/api/blogs`)
- `GET    /api/blogs` — Filtered & paginated article feed (supports `search`, `category`, `tag`, `sort`, `page`, `limit`)
- `GET    /api/blogs/featured` — Top featured articles for hero showcase
- `GET    /api/blogs/trending` — Top 5 trending articles
- `GET    /api/blogs/:slug` — Article details with interaction telemetry
- `GET    /api/blogs/:id/related` — Contextual related articles
- `POST   /api/blogs` — Create new blog post (Protected)
- `PUT    /api/blogs/:id` — Update article (Author or Admin)
- `DELETE /api/blogs/:id` — Delete article (Author or Admin)
- `POST   /api/blogs/:id/like` — Toggle Like/Unlike (Protected)

### Bookmarks & Reading List (`/api/bookmarks`)
- `GET  /api/bookmarks` — List of bookmarked articles (Protected)
- `POST /api/bookmarks/:blogId` — Toggle article in reading list (Protected)

### Comments (`/api/comments`)
- `GET    /api/comments/blog/:blogId` — Get threaded comments
- `POST   /api/comments` — Post comment or nested reply (Protected)
- `DELETE /api/comments/:id` — Remove comment (Author or Admin)
- `POST   /api/comments/:id/like` — Like/Unlike comment (Protected)

### Administration (`/api/admin` — Protected & Admin Only)
- `GET    /api/admin/stats` — Global telemetry & analytics breakdown
- `GET    /api/admin/users` — User management directory
- `PUT    /api/admin/users/:id/role` — Update user role (User ↔ Admin)
- `DELETE /api/admin/users/:id` — Delete user account & content
- `GET    /api/admin/blogs` — All articles table with filters
- `PUT    /api/admin/blogs/:id/feature` — Toggle featured badge
- `GET    /api/admin/comments` — Comment moderation table

---

## 📄 License
This project is licensed under the MIT License.
#   B l o g g i n g - A p p l i c a t i o n  
 