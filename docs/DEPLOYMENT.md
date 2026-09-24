# Deployment template

The application is configured to run locally by default. For a later deployment, replace `your-domain.tld` in the production environment templates with the hostnames configured by your provider.

## MySQL

Create a production database and restricted database user, grant the user access, then import `database/schema.sql` and optionally `database/seed.sql`. If the host prefixes database names, use its assigned name in the backend environment.

## Frontends

Set `VITE_API_URL=https://api.your-domain.tld/api` for both static builds and set `VITE_PUBLIC_URL=https://your-domain.tld` for admin. Build each separately:

```sh
cd frontend && npm ci && npm run build
cd ../admin && npm ci && npm run build
```

Upload each `dist/` folder to the corresponding static site root. Keep the `.htaccess` file next to `index.html` on Apache/cPanel so client-side routes resolve.

## API and secrets

Run the API as a Node.js application rooted at `backend`, with startup file `src/server.js` and Node 20+. Configure the service from `backend/.env.production.example`; replace all database placeholders and use a fresh `SESSION_SECRET` generated on the host:

```sh
node -e "console.log(require('node:crypto').randomBytes(48).toString('hex'))"
```

Keep secrets out of the repository and outside public document roots. Use HTTPS for the frontends and API, a restricted database account, and make `backend/public/uploads` writable by the Node app. Set `FRONTEND_URL`, `ADMIN_URL`, and `PUBLIC_API_URL` to the actual hostnames so production CORS and generated file URLs work.

After importing the schema and starting the API, open the admin app's `/setup` page to create the first administrator. Setup is available only while the admins table is empty.
