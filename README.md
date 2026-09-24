# Archirani

Architecture project platform with three applications that run locally:

- `frontend/`: public website at `http://localhost:5173`
- `admin/`: admin dashboard at `http://localhost:5174`
- `backend/`: Express API at `http://localhost:3000`
- `database/`: MySQL schema and sample projects

## Run locally with MySQL

1. Start MySQL and import `database/schema.sql`, then `database/seed.sql` for sample categories and projects. The starter database is named `archihome` to preserve the existing schema and local database.
2. Check `backend/.env`; it should use `NODE_ENV=development`, `DB_HOST=127.0.0.1`, `DB_PORT=3306`, the local MySQL database/user/password, and a random `SESSION_SECRET`. Do not commit this file.
3. Start the API in a terminal:

   ```powershell
   cd backend
   npm install
   npm run dev
   ```

4. Start the public site in another terminal:

   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

5. Start the admin dashboard in a third terminal:

   ```powershell
   cd admin
   npm install
   npm run dev
   ```

6. Open `http://localhost:5173` for the public site and `http://localhost:5174/setup` to create the first admin. Setup is available only while the admins table is empty; the password must be at least 12 characters.

The Vite apps use `/api` locally and proxy requests to the backend on port 3000. If MySQL is unavailable in development, the API falls back to temporary in-memory demo data; changes in demo mode are not saved to MySQL.

Admin → Configuration saves the site name, contact details, and LinkedIn/Instagram/Facebook profile URLs. Those details appear on the public site; social icons show after their profile URLs are saved.

For optional later hosting, use the `.env.production.example` files and replace their generic `your-domain.tld` values with your hosting provider's values. No specific domain is configured in this project.
