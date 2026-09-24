# SKILLS.md — Archirani

## Full technical specification for a production architecture-project platform

> Master specification for an AI coding agent/developer. Build exactly this architecture unless a requirement is explicitly changed.

---

# 1. Project

**Archirani** is a web platform for an architecture/exterior-design company. Visitors browse house projects and can inspect:

- exterior photos
- architectural information
- interactive 3D exterior models (`.glb` / `.gltf`)
- 2D floor plans (`png`, `jpg`, `webp`, `pdf`)
- project gallery
- downloadable PDF plans
- contact form

The administrator manages projects from a **separate React application**.

## Domains

```text
https://www.archi.com       -> public React frontend
https://admin.archi.com     -> separate admin React frontend
https://api.archi.com       -> Node.js + Express REST API
```

The exact production domain may be different; keep the three-subdomain architecture.

---

# 2. Non-negotiable architecture

```text
                     ARCHIRANI
                         |
        +----------------+----------------+
        |                |                |
        v                v                v
 www.archi.com    admin.archi.com   api.archi.com
        |                |                |
        v                v                v
 Public React       Admin React      Node + Express
        |                |                |
        +----------------+----------------+
                         |
                         v
                       MySQL
                       cPanel
                         |
             +-----------+-----------+
             |           |           |
             v           v           v
          Images        GLB       Plans/PDF
```

Rules:

1. Public and admin are separate React/Vite applications.
2. Admin UI must NOT be inside the public React app.
3. MySQL is the only application database.
4. Backend is Node.js + Express.
5. Do not introduce Firebase, Supabase, MongoDB or PostgreSQL.
6. Store files on the server/storage; store only paths/URLs and metadata in MySQL.
7. Admin authentication uses secure HttpOnly cookies.
8. Every admin endpoint is authenticated and authorized.
9. Public API returns only published projects.
10. The system must be deployable on cPanel shared hosting with Node.js support.

---

# 3. Technology stack

## Public frontend

- React
- Vite
- Tailwind CSS
- React Router
- Axios
- React Hook Form
- Zod
- Lucide React

## Admin frontend

- React
- Vite
- Tailwind CSS
- React Router
- Axios
- React Hook Form
- Zod
- Lucide React

## 3D

- Three.js
- `@react-three/fiber`
- `@react-three/drei`

## Backend

- Node.js
- Express.js
- `mysql2/promise`
- bcrypt
- cookie-parser
- cors
- helmet
- express-rate-limit
- multer
- zod
- dotenv

## Database / hosting

- MySQL 8+
- cPanel
- cPanel Node.js Application
- Apache/SSL
- subdomains

---

# 4. Repository

```text
archihome/
├── frontend/                 # www.archi.com
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       │   ├── common/
│       │   ├── layout/
│       │   ├── projects/
│       │   ├── gallery/
│       │   ├── viewer3d/
│       │   └── plans/
│       ├── pages/
│       ├── layouts/
│       ├── routes/
│       ├── services/
│       ├── hooks/
│       ├── schemas/
│       ├── utils/
│       ├── App.jsx
│       └── main.jsx
│
├── admin/                    # admin.archi.com
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── layout/
│       │   ├── dashboard/
│       │   ├── projects/
│       │   ├── uploads/
│       │   ├── plans/
│       │   ├── gallery/
│       │   ├── categories/
│       │   └── messages/
│       ├── pages/
│       ├── layouts/
│       ├── routes/
│       ├── services/
│       ├── hooks/
│       ├── context/
│       ├── schemas/
│       ├── App.jsx
│       └── main.jsx
│
├── backend/                  # api.archi.com
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── validators/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   ├── public/uploads/
│   │   ├── projects/
│   │   ├── models/
│   │   ├── plans/
│   │   └── documents/
│   └── .env
│
├── database/
│   ├── schema.sql
│   ├── seed.sql
│   └── migrations/
└── docs/
    ├── API.md
    └── DEPLOYMENT.md
```

---

# 5. Database

Database name:

```text
archihome
```

Use:

```sql
ENGINE=InnoDB
DEFAULT CHARACTER SET utf8mb4
COLLATE=utf8mb4_unicode_ci
```

## 5.1 admins

```sql
CREATE TABLE admins (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin','super_admin') NOT NULL DEFAULT 'admin',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login_at DATETIME NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_admins_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

Never store plaintext passwords.

## 5.2 categories

```sql
CREATE TABLE categories (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(120) NOT NULL UNIQUE,
    description VARCHAR(500) NULL,
    image_url VARCHAR(500) NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

Examples: `Moderne`, `Contemporain`, `Minimaliste`, `Traditionnel`, `Luxe`, `Méditerranéen`.

## 5.3 projects

```sql
CREATE TABLE projects (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    category_id INT UNSIGNED NULL,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(240) NOT NULL UNIQUE,
    short_description VARCHAR(500) NULL,
    description TEXT NULL,
    style VARCHAR(100) NULL,
    surface DECIMAL(10,2) NULL,
    land_surface DECIMAL(10,2) NULL,
    floors TINYINT UNSIGNED NOT NULL DEFAULT 1,
    bedrooms TINYINT UNSIGNED NOT NULL DEFAULT 0,
    bathrooms TINYINT UNSIGNED NOT NULL DEFAULT 0,
    garage BOOLEAN NOT NULL DEFAULT FALSE,
    location VARCHAR(255) NULL,
    model_3d_url VARCHAR(500) NULL,
    status ENUM('draft','published','archived') NOT NULL DEFAULT 'draft',
    views INT UNSIGNED NOT NULL DEFAULT 0,
    published_at DATETIME NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_projects_category FOREIGN KEY (category_id)
        REFERENCES categories(id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_projects_category (category_id),
    INDEX idx_projects_status (status),
    INDEX idx_projects_created (created_at),
    INDEX idx_projects_views (views)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

A project represents one house/design.

## 5.4 project_images

```sql
CREATE TABLE project_images (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    project_id INT UNSIGNED NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255) NULL,
    sort_order INT UNSIGNED NOT NULL DEFAULT 0,
    is_cover BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_project_images_project FOREIGN KEY (project_id)
        REFERENCES projects(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_project_images_project (project_id),
    INDEX idx_project_images_order (project_id, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 5.5 project_plans

```sql
CREATE TABLE project_plans (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    project_id INT UNSIGNED NOT NULL,
    floor_name VARCHAR(100) NOT NULL,
    floor_number INT NOT NULL DEFAULT 0,
    image_url VARCHAR(500) NULL,
    pdf_url VARCHAR(500) NULL,
    sort_order INT UNSIGNED NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_project_plans_project FOREIGN KEY (project_id)
        REFERENCES projects(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_project_plans_project (project_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

One project can have RDC, first floor, second floor, roof, etc.

## 5.6 project_views

```sql
CREATE TABLE project_views (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    project_id INT UNSIGNED NOT NULL,
    viewed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ip_hash VARCHAR(128) NULL,
    user_agent VARCHAR(500) NULL,
    CONSTRAINT fk_project_views_project FOREIGN KEY (project_id)
        REFERENCES projects(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_project_views_project (project_id),
    INDEX idx_project_views_date (viewed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

Use privacy-conscious analytics. Avoid storing raw IP unless there is a real need.

## 5.7 messages

```sql
CREATE TABLE messages (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NULL,
    subject VARCHAR(255) NULL,
    message TEXT NOT NULL,
    status ENUM('unread','read','archived') NOT NULL DEFAULT 'unread',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_messages_status (status),
    INDEX idx_messages_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 5.8 audit_logs

```sql
CREATE TABLE audit_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    admin_id INT UNSIGNED NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NULL,
    entity_id INT UNSIGNED NULL,
    metadata JSON NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_logs_admin FOREIGN KEY (admin_id)
        REFERENCES admins(id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_audit_admin (admin_id),
    INDEX idx_audit_entity (entity_type, entity_id),
    INDEX idx_audit_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 5.9 site_settings

```sql
CREATE TABLE site_settings (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

Possible keys:

```text
site_name
company_email
company_phone
company_address
logo_url
facebook_url
instagram_url
linkedin_url
```

---

# 6. Database relationships

```text
categories 1 ---- N projects
projects   1 ---- N project_images
projects   1 ---- N project_plans
projects   1 ---- N project_views
admins     1 ---- N audit_logs
messages          independent contact records
```

Rules:

- `projects.category_id` → `categories.id`, `ON DELETE SET NULL`
- project child records → `ON DELETE CASCADE`
- admin audit records → `ON DELETE SET NULL`
- use prepared statements only
- never concatenate SQL with request data

---

# 7. Public frontend pages

## `/`

Homepage:

```text
Navbar
Hero
Featured projects
Architecture styles
3D showcase
Why choose us
CTA
Footer
```

Hero example:

```text
DES MAISONS QUI INSPIRENT
Découvrez nos projets d'architecture moderne
avec vues 3D et plans 2D.

[ Rechercher un projet... ] [ Découvrir les projets ]
```

## `/projects`

Features:

- search
- category filter
- style filter
- surface range
- sorting
- pagination

## `/projects/:slug`

Display:

- breadcrumb
- title
- category
- style
- surface
- land surface
- floors
- bedrooms
- bathrooms
- garage
- location
- gallery
- 3D viewer
- 2D plan viewer
- description
- contact CTA

## `/about`

Company presentation.

## `/contact`

Contact form.

---

# 8. Public project UI

Project card:

```text
+-------------------------+
|       COVER IMAGE       |
+-------------------------+
| Villa Moderne           |
| Moderne · 220 m²       |
| 2 étages                |
|                         |
| [ Voir le projet -> ]   |
+-------------------------+
```

Project details:

```text
Breadcrumb
        ↓
Title + metadata
        ↓
Gallery
        ↓
[ Vue 3D ] [ Plan 2D ] [ Galerie ]
        ↓
Viewer
        ↓
Technical details
        ↓
Description
        ↓
Contact CTA
```

---

# 9. 3D viewer

Use:

```text
Three.js
React Three Fiber
Drei
GLTFLoader
OrbitControls
```

Component:

```jsx
<House3DViewer modelUrl={project.model3dUrl} />
```

Controls:

- rotate
- zoom
- pan
- reset
- fullscreen
- front
- back
- left
- right

Do not load all 3D models on the project listing. Load the model only when the user opens the 3D viewer/tab.

Recommended advanced optimization when needed:

```text
Draco compression
KTX2/Basis textures
reduced polygon count
optimized textures
```

---

# 10. 2D plan viewer

Supported:

```text
PNG
JPG/JPEG
WEBP
PDF
SVG (if required)
```

UI:

```text
[ RDC ] [ 1er étage ] [ Toiture ]

+----------------------------------+
|                                  |
|             PLAN 2D              |
|                                  |
|                 +   -            |
+----------------------------------+

[ Télécharger le PDF ]
```

Features:

- zoom
- pan
- fullscreen
- floor tabs
- PDF download
- loading state
- empty state
- error state

---

# 11. Admin application

Domain:

```text
https://admin.archi.com
```

Routes:

```text
/admin/login
/admin
/admin/projects
/admin/projects/new
/admin/projects/:id/edit
/admin/categories
/admin/messages
/admin/settings
```

The admin frontend is a completely separate build from `frontend/`.

---

# 12. Admin login

UI:

```text
+-------------------------------+
|          Archirani            |
|        Admin Dashboard        |
|                               |
| Email                         |
| [_________________________]   |
|                               |
| Password                      |
| [_________________________]   |
|                               |
| [       Se connecter       ]  |
+-------------------------------+
```

Flow:

```text
POST /api/auth/login
       ↓
server validates credentials
       ↓
bcrypt.compare()
       ↓
create authenticated session/cookie
       ↓
admin dashboard
```

---

# 13. Admin dashboard

Main cards:

```text
Total Projects
Published
Drafts
Archived
Total Views
Messages
Unread Messages
Categories
```

Sections:

- recent projects
- popular projects
- views chart
- messages preview

---

# 14. Admin project management

`/admin/projects`

Table:

```text
Cover | Title | Category | Surface | Status | Views | Date | Actions
```

Actions:

```text
View
Edit
Publish
Unpublish
Archive
Delete
```

Destructive actions require confirmation.

---

# 15. Project creation wizard

Route:

```text
/admin/projects/new
```

Steps:

```text
1. Informations
2. 3D Model
3. 2D Plans
4. Gallery
5. Preview
6. Publication
```

## Step 1: Information

Fields:

```text
title *
slug *
short_description
description
category_id *
style
surface
land_surface
floors
bedrooms
bathrooms
garage
location
```

Validation:

```text
title required
category required
surface >= 0
land_surface >= 0
floors >= 1
bedrooms >= 0
bathrooms >= 0
```

## Step 2: 3D

Upload `.glb` or `.gltf`.

Show:

```text
filename
size
progress
success/error
remove
```

## Step 3: Plans

For each floor:

```text
floor_name
floor_number
image
pdf
```

Examples:

```text
Rez-de-chaussée
1er étage
2ème étage
Toiture
```

## Step 4: Gallery

Features:

- multiple upload
- preview
- remove
- reorder
- cover image
- alt text

## Step 5: Preview

Admin sees the public project presentation before publishing.

## Step 6: Publication

```text
[ Save Draft ]
[ Publish ]
```

---

# 16. Project status

```text
draft      -> private
published  -> public
archived   -> private/archive
```

Only `published` projects are returned by public project listing/detail endpoints.

---

# 17. Categories

Admin route:

```text
/admin/categories
```

CRUD:

```text
GET    /api/categories
POST   /api/admin/categories
PUT    /api/admin/categories/:id
DELETE /api/admin/categories/:id
```

---

# 18. Messages

Public form:

```text
Name
Email
Phone
Subject
Message
[ Envoyer ]
```

Admin:

```text
/admin/messages
```

Features:

- list
- search
- filter status
- read/unread
- archive
- delete
- detail view

---

# 19. Complete REST API

Base URL:

```text
https://api.archi.com/api
```

## Health

```http
GET /api/health
```

## Authentication

```http
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/logout
PUT  /api/auth/password
```

## Public projects

```http
GET /api/projects
GET /api/projects/:slug
POST /api/projects/:id/view
GET /api/projects/:id/images
GET /api/projects/:id/plans
```

## Public categories

```http
GET /api/categories
GET /api/categories/:slug
```

## Public messages

```http
POST /api/messages
```

## Admin projects

```http
GET    /api/admin/projects
GET    /api/admin/projects/:id
POST   /api/admin/projects
PUT    /api/admin/projects/:id
DELETE /api/admin/projects/:id
PATCH  /api/admin/projects/:id/publish
PATCH  /api/admin/projects/:id/unpublish
PATCH  /api/admin/projects/:id/archive
```

## Admin 3D

```http
POST   /api/admin/projects/:id/model
DELETE /api/admin/projects/:id/model
```

## Admin images

```http
POST   /api/admin/projects/:id/images
PUT    /api/admin/images/:imageId
DELETE /api/admin/images/:imageId
PATCH  /api/admin/projects/:id/images/reorder
```

## Admin plans

```http
POST   /api/admin/projects/:id/plans
PUT    /api/admin/plans/:planId
DELETE /api/admin/plans/:planId
```

## Admin categories

```http
POST   /api/admin/categories
PUT    /api/admin/categories/:id
DELETE /api/admin/categories/:id
```

## Admin messages

```http
GET    /api/admin/messages
GET    /api/admin/messages/:id
PATCH  /api/admin/messages/:id/read
PATCH  /api/admin/messages/:id/unread
PATCH  /api/admin/messages/:id/archive
DELETE /api/admin/messages/:id
```

## Dashboard

```http
GET /api/admin/dashboard/stats
GET /api/admin/dashboard/recent-projects
GET /api/admin/dashboard/popular-projects
```

---

# 20. API request examples

## Create project

```json
{
  "title": "Villa Moderne",
  "shortDescription": "Villa moderne de 220 m²",
  "description": "Projet de villa moderne avec grande terrasse et jardin.",
  "categoryId": 1,
  "style": "Moderne",
  "surface": 220,
  "landSurface": 350,
  "floors": 2,
  "bedrooms": 4,
  "bathrooms": 3,
  "garage": true,
  "location": "Sousse",
  "status": "draft"
}
```

## Login

```json
{
  "email": "admin@example.com",
  "password": "********"
}
```

## Contact

```json
{
  "name": "Ahmed",
  "email": "ahmed@example.com",
  "phone": "+21600000000",
  "subject": "Projet villa",
  "message": "Je voudrais plus d'informations."
}
```

---

# 21. API response format

Success:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Project not found",
  "code": "PROJECT_NOT_FOUND"
}
```

Validation:

```json
{
  "success": false,
  "message": "Validation failed",
  "code": "VALIDATION_ERROR",
  "errors": {
    "title": "Title is required"
  }
}
```

Never expose production stack traces, SQL errors, credentials or internal paths.

---

# 22. Pagination / filtering

Project list:

```http
GET /api/projects?page=1&limit=12&search=villa&category=moderne&style=contemporain&minSurface=150&maxSurface=300&sort=latest
```

Response:

```json
{
  "success": true,
  "data": {
    "projects": [],
    "pagination": {
      "page": 1,
      "limit": 12,
      "total": 42,
      "totalPages": 4
    }
  }
}
```

Always cap `limit` server-side to prevent expensive queries.

---

# 23. Upload architecture

Never put binary files in MySQL.

```text
Browser
  ↓ multipart/form-data
Express + Multer
  ↓ validate type/size
Filesystem/storage
  ↓
/uploads/models/villa.glb
/uploads/plans/rdc.png
/uploads/projects/front.webp
  ↓
MySQL stores URL/path only
```

Generate random filenames server-side.

Bad:

```text
../../shell.php
```

Good:

```text
uuid-house.glb
```

---

# 24. Allowed files

Images:

```text
jpg
jpeg
png
webp
```

3D:

```text
glb
gltf
```

Plans/documents:

```text
jpg
jpeg
png
webp
pdf
```

Recommended initial limits:

```text
image: 10 MB
PDF: 20 MB
3D: 100 MB
```

These limits must also respect the actual cPanel/Node hosting limits.

Do not trust file extension alone. Validate MIME/type and, where practical, inspect file signatures/content.

---

# 25. File lifecycle

When deleting a gallery image, model or plan:

```text
DB record
  +
physical file
```

Both must be handled.

For project deletion:

```text
BEGIN transaction if DB changes are multi-step
↓
delete project children by FK cascade
↓
commit
↓
remove associated physical files
```

If a physical file cannot be removed, log the failure for cleanup rather than claiming everything succeeded.

---

# 26. Authentication / authorization

Recommended production flow:

```text
Admin browser
  ↓
POST /api/auth/login
  ↓
validate email/password
  ↓
bcrypt.compare
  ↓
create secure authenticated session
  ↓
HttpOnly cookie
```

Cookie settings in production should include:

```text
HttpOnly=true
Secure=true
SameSite=Lax (or stricter if compatible)
```

Do not put sensitive auth tokens in localStorage when secure HttpOnly cookies are used.

Every admin request:

```text
cookie
 ↓
auth middleware
 ↓
active admin check
 ↓
role check
 ↓
controller
```

---

# 27. Security

Backend must use:

- Helmet
- restricted CORS
- rate limiting
- input validation
- prepared SQL statements
- bcrypt
- secure cookies
- upload validation
- authorization
- error sanitization
- environment variables

CORS should allow only:

```text
https://www.archi.com
https://admin.archi.com
```

Do not use wildcard CORS with credentialed cookies.

Rate limit especially:

```text
login
contact form
public view endpoint
```

---

# 28. Backend architecture

```text
Request
 ↓
Route
 ↓
Middleware
 ↓
Controller
 ↓
Service
 ↓
Repository
 ↓
MySQL
```

Recommended backend files:

```text
src/
├── config/
│   ├── database.js
│   └── env.js
├── controllers/
│   ├── auth.controller.js
│   ├── project.controller.js
│   ├── category.controller.js
│   ├── image.controller.js
│   ├── plan.controller.js
│   ├── message.controller.js
│   └── dashboard.controller.js
├── services/
│   ├── auth.service.js
│   ├── project.service.js
│   ├── upload.service.js
│   ├── plan.service.js
│   ├── message.service.js
│   └── dashboard.service.js
├── repositories/
│   ├── admin.repository.js
│   ├── project.repository.js
│   ├── category.repository.js
│   ├── image.repository.js
│   ├── plan.repository.js
│   └── message.repository.js
├── middleware/
│   ├── auth.middleware.js
│   ├── role.middleware.js
│   ├── upload.middleware.js
│   ├── validation.middleware.js
│   ├── rateLimit.middleware.js
│   ├── error.middleware.js
│   └── notFound.middleware.js
├── validators/
├── routes/
├── utils/
├── app.js
└── server.js
```

---

# 29. MySQL access

Use:

```js
mysql2/promise
```

Create one connection pool.

Conceptually:

```text
Controller
  ↓
Service
  ↓
Repository
  ↓
pool.execute(sql, params)
```

Never create a new unmanaged DB connection for every request.

---

# 30. Transactions

Use transactions for operations that modify multiple DB records and must be atomic.

Example project creation with metadata:

```text
BEGIN
 ↓
insert project
 ↓
insert related plan/image metadata
 ↓
COMMIT
```

Failure:

```text
ROLLBACK
```

Files uploaded before a failed DB transaction should be cleaned up.

---

# 31. Environment variables

Public frontend:

```env
VITE_API_URL=https://api.archi.com/api
```

Admin frontend:

```env
VITE_API_URL=https://api.archi.com/api
```

Backend:

```env
NODE_ENV=production
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=cpuser_archihome
DB_USER=cpuser_archihome_user
DB_PASSWORD=********
FRONTEND_URL=https://www.archi.com
ADMIN_URL=https://admin.archi.com
SESSION_SECRET=********
UPLOAD_DIR=public/uploads
```

Never commit `.env`.

---

# 32. cPanel deployment

## Domains/subdomains

Create:

```text
www.archi.com
admin.archi.com
api.archi.com
```

## MySQL

In cPanel:

1. Create database.
2. Create database user.
3. Assign user to database.
4. Grant required privileges.
5. Import `database/schema.sql`.
6. Run seed only with safe production credentials.

## Public frontend

```bash
npm run build
```

Upload `frontend/dist/*` to the document root of `www.archi.com`.

## Admin frontend

```bash
npm run build
```

Upload `admin/dist/*` to the document root of `admin.archi.com`.

## Backend

Create cPanel Node.js Application:

```text
Application root: archihome-backend
Application URL: api.archi.com
Startup file: src/server.js
```

Use a Node version supported by the hosting provider.

Install production dependencies and configure `.env`.

---

# 33. React Router `.htaccess`

For Apache-hosted React SPAs, use an appropriate rewrite rule such as:

```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

Apply it separately to the public and admin SPA document roots.

---

# 34. Static uploads

Express can expose uploads:

```js
app.use('/uploads', express.static(uploadDirectory));
```

Example:

```text
https://api.archi.com/uploads/models/villa.glb
```

The API should return consistent absolute or documented relative URLs.

---

# 35. Frontend components

Public:

```text
Navbar
Footer
Hero
SearchBar
CategoryFilter
ProjectCard
ProjectGrid
ProjectGallery
ProjectInfo
House3DViewer
ViewerControls
PlanViewer
FloorTabs
PlanDownload
ContactForm
LoadingState
EmptyState
ErrorState
```

Admin:

```text
AdminSidebar
AdminNavbar
StatCard
ProjectTable
ProjectForm
ProjectWizard
ModelUploader
PlanUploader
ImageUploader
ImageSortableGrid
CategoryTable
MessageTable
ConfirmDialog
Toast
```

---

# 36. Frontend services

Public:

```text
api.js
project.service.js
category.service.js
message.service.js
```

Admin:

```text
api.js
auth.service.js
project.service.js
category.service.js
image.service.js
plan.service.js
message.service.js
dashboard.service.js
```

---

# 37. Loading / error / empty states

Every asynchronous screen must handle:

```text
loading
success
empty
error
retry
```

Example project empty state:

```text
Aucun projet trouvé.
[ Effacer les filtres ]
```

3D error:

```text
Impossible de charger le modèle 3D.
[ Réessayer ]
```

---

# 38. Responsive design

Mobile:

- one-column project cards
- mobile navbar
- full-width 3D viewer
- admin sidebar becomes drawer

Tablet:

- two-column cards

Desktop:

- three/four-column cards
- wide architecture images
- dashboard sidebar

---

# 39. UI design

Visual direction:

```text
Premium
Minimal
Architectural
Modern
Clean
Professional
```

Suggested colors:

```text
Background #F7F7F5
Primary    #0F172A
Secondary  #334155
Accent     #2563EB
Text       #111827
Muted      #64748B
Success    #16A34A
Warning    #F59E0B
```

Public site should emphasize large architectural photography and whitespace.

3D viewer should use a dark professional canvas.

Admin dashboard should use a light clean UI with cards, tables and clear status badges.

---

# 40. SEO

For public project pages:

- unique title
- meta description
- canonical URL
- Open Graph metadata
- cover image
- descriptive alt text
- semantic headings
- sitemap
- robots.txt

Project URL:

```text
/projects/villa-moderne-220m2
```

not:

```text
/projects?id=42
```

Generate unique slugs from titles and handle collisions.

---

# 41. Performance

Public:

- route lazy loading
- image lazy loading
- WebP/optimized images
- responsive images
- pagination
- API filtering
- database indexes
- lazy 3D loading

3D:

- optimize geometry
- compress textures
- reduce polygon count
- do not load every project model on `/projects`

---

# 42. Dashboard statistics

`GET /api/admin/dashboard/stats`

Return:

```json
{
  "totalProjects": 42,
  "publishedProjects": 35,
  "draftProjects": 7,
  "archivedProjects": 0,
  "totalCategories": 6,
  "totalMessages": 28,
  "unreadMessages": 5,
  "totalViews": 15420
}
```

Optional charts:

- views over time
- projects by category
- published vs draft

Do not over-engineer analytics in MVP.

---

# 43. Audit log events

Recommended actions:

```text
ADMIN_LOGIN
ADMIN_LOGOUT
PROJECT_CREATED
PROJECT_UPDATED
PROJECT_DELETED
PROJECT_PUBLISHED
PROJECT_UNPUBLISHED
PROJECT_ARCHIVED
MODEL_UPLOADED
MODEL_DELETED
PLAN_UPLOADED
PLAN_DELETED
IMAGE_UPLOADED
IMAGE_DELETED
CATEGORY_CREATED
CATEGORY_UPDATED
CATEGORY_DELETED
MESSAGE_ARCHIVED
```

---

# 44. Testing checklist

## Authentication

```text
[ ] valid login
[ ] invalid password
[ ] invalid email
[ ] logout
[ ] expired/invalid session
[ ] inactive admin
[ ] unauthorized endpoint
[ ] rate limit
```

## Projects

```text
[ ] create
[ ] read
[ ] update
[ ] delete
[ ] publish
[ ] unpublish
[ ] archive
[ ] search
[ ] filter
[ ] pagination
```

## Files

```text
[ ] upload image
[ ] reject invalid image
[ ] reject oversized image
[ ] upload GLB
[ ] reject invalid 3D file
[ ] upload PDF
[ ] delete physical file
[ ] delete DB metadata
```

## Public

```text
[ ] homepage
[ ] project listing
[ ] project detail
[ ] gallery
[ ] 3D
[ ] 2D
[ ] PDF download
[ ] contact
[ ] mobile
```

---

# 45. Development order

## Phase 1 — Foundation

```text
Git repository
frontend
admin
backend
database
environment configuration
```

## Phase 2 — Database

Create:

```text
admins
categories
projects
project_images
project_plans
project_views
messages
audit_logs
site_settings
```

## Phase 3 — Backend

Implement:

```text
health
DB pool
error middleware
auth
projects
categories
images
plans
uploads
messages
dashboard
```

## Phase 4 — Public frontend

```text
layout
home
projects
filters
project details
gallery
3D viewer
2D viewer
contact
```

## Phase 5 — Admin frontend

```text
login
dashboard
project CRUD
wizard
3D upload
plans
gallery
categories
messages
settings
```

## Phase 6 — Security

```text
authentication
authorization
validation
rate limiting
CORS
Helmet
upload security
```

## Phase 7 — Optimization

```text
lazy loading
image optimization
3D optimization
pagination
indexes
```

## Phase 8 — Deployment

```text
MySQL
API subdomain
public subdomain
admin subdomain
SSL
DNS
uploads
production testing
```

---

# 46. AI coding-agent rules

The coding agent MUST:

1. Read this specification before coding.
2. Build database schema before dependent CRUD.
3. Keep public and admin React apps separate.
4. Keep API separate from both frontends.
5. Respect the exact endpoint contracts.
6. Use MySQL, not another database.
7. Store file references in DB, not file binaries.
8. Protect every admin endpoint.
9. Never expose draft projects through public endpoints.
10. Never hard-code production credentials.
11. Never use localStorage for sensitive authentication when HttpOnly cookies are available.
12. Validate files server-side.
13. Handle loading/error/empty states.
14. Make all public/admin pages responsive.
15. Run build/tests after major changes.
16. Do not claim a feature is finished until frontend, backend and database are connected.
17. Do not add unnecessary infrastructure incompatible with normal cPanel hosting.
18. Preserve existing working code when modifying features.
19. When changing a DB field, update schema, repository, service, controller, validation and affected frontend forms/views.
20. When adding an endpoint, update route, controller, service, validation, frontend service and UI where applicable.

---

# 47. End-to-end acceptance test

The following exact flow must work:

```text
ADMIN
  |
  v
https://admin.archi.com
  |
  +--> Login
  |
  +--> New Project
  |       |
  |       +--> Villa Moderne
  |       +--> category = Moderne
  |       +--> 220 m²
  |       +--> 350 m² terrain
  |       +--> 2 floors
  |       +--> 4 bedrooms
  |       +--> 3 bathrooms
  |       |
  |       +--> upload villa.glb
  |       +--> upload RDC.png
  |       +--> upload Etage.png
  |       +--> upload plans.pdf
  |       +--> upload exterior images
  |       |
  |       +--> Preview
  |       +--> Publish
  |
  v
PUBLIC
  |
  v
https://www.archi.com/projects
  |
  +--> Villa Moderne appears
  |
  +--> open project
  |
  +--> gallery
  +--> 3D exterior
  +--> 2D plans
  +--> PDF download
  +--> contact
  |
  v
ADMIN
  |
  v
https://admin.archi.com/messages
  |
  +--> visitor message appears
```

This is the primary MVP acceptance test.

---

# 48. Final definition of done

The project is complete only when:

- public frontend is deployed on `www.archi.com`
- admin frontend is deployed separately on `admin.archi.com`
- Express API is available on `api.archi.com`
- MySQL works on cPanel
- admin authentication works
- project CRUD works
- category CRUD works
- 3D upload/display works
- 2D plan upload/display works
- gallery upload/reorder/delete works
- publishing works
- public project filtering/search works
- contact messages work
- dashboard statistics work
- authorization prevents unauthorized admin access
- invalid uploads are rejected
- production errors do not leak secrets/SQL internals
- mobile responsive UI works
- the complete admin → publish → public → contact flow works

---

# 49. Final system map

```text
                           ARCHIRANI
                               |
             +-----------------+------------------+
             |                 |                  |
             v                 v                  v
       www.archi.com     admin.archi.com     api.archi.com
             |                 |                  |
             v                 v                  v
        PUBLIC REACT       ADMIN REACT       EXPRESS API
             |                 |                  |
             |                 |          +-------+-------+
             |                 |          |       |       |
             |                 |          v       v       v
             |                 |        Auth   Projects Uploads
             |                 |          |       |       |
             +-----------------+----------+-------+-------+
                                       |
                                       v
                                     MySQL
                                       |
                  +--------------------+-------------------+
                  |                    |                   |
                  v                    v                   v
              categories           projects            messages
                                       |
                         +-------------+-------------+
                         |                           |
                         v                           v
                  project_images              project_plans
                         |
                         v
                   project_views

FILES:
/uploads/projects/
/uploads/models/
/uploads/plans/
/uploads/documents/
```

