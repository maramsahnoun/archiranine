# Archirani API

Base path: `/api`. Success and error responses use the envelope documented in `ArchiHome_SKILLS.md`.

## Public endpoints

- `GET /health`
- `GET /settings` — public site name, contact details, and configured LinkedIn/Instagram/Facebook profile URLs (never admin or secret settings).
- `GET /projects` — search, category, style, surface range, sort, pagination; published projects only.
- `GET /projects/:slug`, `GET /projects/:id/images`, `GET /projects/:id/plans`
- `POST /projects/:id/view`
- `GET /categories`, `GET /categories/:slug`
- `POST /messages`

## Admin endpoints

Sign in with `POST /auth/login`; the API sets the `archihome_session` HttpOnly cookie. Use `GET /auth/me` to restore a session, `POST /auth/logout` to clear it, and `PUT /auth/password` to rotate a password. All `/admin/*` endpoints require an active administrator session.

The API includes dashboard stats/recent/popular projects; project CRUD and publish/unpublish/archive actions; 3D, image, and plan upload/removal; category CRUD; messages read/unread/archive/delete; and site settings read/update. Project creation and updates accept the camelCase JSON fields in the specification. Upload multipart field names are `model`, `images`, and `plans`.

In `NODE_ENV=development`, if the initial MySQL connection fails, the API serves an in-memory sample API and returns `X-Archirani-Demo: true`. It is for local preview only; its edits and uploads are temporary. Production mode never enables this fallback.

Files are size limited, extension and MIME checked, then signature checked before they are associated with a project. Uploads are served from `/uploads`. Admin role levels are `admin` and `super_admin`; administrator provisioning is performed out of band with `npm run create-admin`.
