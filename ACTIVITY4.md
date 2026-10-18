# ICT251 Activity 4 - William Kapinga

Theme: Question 11, Portfolio Landing. Resource and table: `portfolio`.
Due date shown in the activity filename: 19 October 2026.

## Run

Use Node.js 24 or newer. In a terminal, change to `myweb/backend`, run `npm install`, then `npm start`.
On this computer dependencies are already installed. Double-click start-activity4.cmd to start the app; keep its terminal open. If the server is already running, open its localhost URL instead of starting a second copy. You can run `node server.js` from backend, or right-click `start-activity4.ps1` and choose Run with PowerShell.
Open http://localhost:3000/ for the existing personal portfolio, and http://localhost:3000/frontend/ for the Activity 4 CRUD interface.
Opening the CRUD HTML directly as a file or with a standalone Live Server does not start the API.

## Files and design

- `backend/.env`: PORT, DB_PATH and CORS_ORIGIN. `.env.example` is safe to commit. No database password is needed for SQLite.
- `backend/schema.sql`: one application table, an auto-increment integer primary key, six theme fields and two timestamps. SQLite also creates its internal `sqlite_sequence` table for AUTOINCREMENT; it is not a second application table.
- `backend/seed.sql`: 10 sample learning records, clearly labelled as sample records.
- `backend/db.js`: creates the SQLite file, initializes schema and seeds once on first creation. Deleting records does not reseed on restart.
- `backend/server.js`: Express, CORS, JSON validation and parameterized SQL; serves both frontends.
- `frontend/index.html`, `app.js`, `styles.css`: single-page form and record table with create, edit, cancel, delete, refresh and errors. Uses fetch and updates after each operation.
- `postman/ICT251-Portfolio.postman_collection.json`: importable requests with automated assertions and a dynamic record ID.
- `backend/test/api.test.js`: isolated API tests using a temporary in-memory database. Run `npm test` in backend.
- `Dockerfile`, `render.yaml`: deployment configuration for Render with a persistent SQLite disk.

The existing portfolio remains in index.html with its photos, recordings and JavaScript features. A navigation link opens the CRUD page.

## API links (local)

| Method | URL | Body |
|---|---|---|
| GET | http://localhost:3000/api/portfolio | None |
| GET | http://localhost:3000/api/portfolio/1 | None |
| POST | http://localhost:3000/api/portfolio | JSON, all six theme fields |
| PUT | http://localhost:3000/api/portfolio/1 | JSON, all six theme fields |
| DELETE | http://localhost:3000/api/portfolio/1 | None |

Use the Postman collection to create and delete a temporary record instead of changing the sample records. POST returns 201; GET, PUT and DELETE return 200. Errors return 400, 404, 413 or 500 as appropriate, all in JSON. DELETE returns JSON instead of the lecture's 204 because the activity explicitly requires JSON responses.

## Render deployment

1. Push the updated project to your GitHub repository, excluding .env, node_modules, .pnpm-store and local database files. Do not commit credentials.
2. Sign in to Render, choose New -> Blueprint, and connect the repository containing render.yaml. Alternatively create a Docker Web Service and configure the same disk and environment variables manually.
3. Review the paid Starter plan and disk cost before approving. A persistent disk is necessary to keep SQLite changes across redeploys. A free ephemeral filesystem is not durable storage.
4. Deploy, wait for health check success, then copy the actual assigned HTTPS origin from Render.
5. Verify the home page, /frontend/, /api/health and all five endpoints on that origin. Update Postman's baseUrl and repeat the collection.
6. For submission, give the actual deployed URL with each method and path listed above. A URL alone does not perform POST, PUT or DELETE; include the method and JSON body example from the collection.

Render storage reference: https://render.com/docs/disks
Node SQLite reference: https://nodejs.org/download/release/latest-v24.x/docs/api/sqlite.html

## Handout inconsistencies

The opening requirement explicitly asks for SQLite, but the quick-start and lecture use MySQL. This implementation follows SQLite and the Node.js/Express requirement. The submission paragraph names Firebase, Supabase and FastAPI while the user selected Render. FastAPI is a Python framework, and Firebase/Supabase do not directly host an ordinary persistent SQLite Express process. Confirm with the lecturer if use of one of those named services is mandatory. Do not claim Render satisfies that exact platform wording without confirmation.

## Submission steps still required

- Deploy to the user's Render account and verify the live links. Configuration alone is not deployment.
- Record the required Postman video following postman/VIDEO-GUIDE.md. Automated API tests are not a Postman video.
- Obtain the lecturer's Google Form URL, then submit the actual deployed links and the video as requested. No form URL was supplied in the activity PDF.

The local application is an open classroom demonstration: the API has no sign-in. Use sample data. Add authentication before using it as a private portfolio administration system.


## Verified results

All four API test groups pass. The Postman collection was executed using Newman: 6 requests and 17 assertions passed with zero failures. Browser create/edit/delete and reload checks passed at desktop and mobile sizes. A separate process restart check confirms deleted records do not reseed. Evidence is in the evidence folder. Newman results do not replace the required screen-recorded Postman video.

