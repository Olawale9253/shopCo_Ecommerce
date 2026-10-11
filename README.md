# Shop.co

A React storefront built with Vite, Redux Toolkit Query, and Express.

## Features

- Product listings from DummyJSON, filtered to fashion categories
- Product details, search, sorting, and shopping cart
- Signup, login, and persistent account sessions

## Run locally

Use Node.js 22.5 or newer for the built-in SQLite support.

```bash
npm install
npm run dev
```

Vite serves the frontend and proxies `/api` requests to the Express server on port 3001. Product requests use `https://dummyjson.com` by default; set `VITE_API_BASE_URL` in `.env` only if you want to use a different compatible API.

## Deploy authentication

Deploy the Express API (`npm run start`) to a Node.js host with persistent disk storage. Set `NODE_ENV=production` and point `SHOPCO_DB_PATH` at a file on that persistent disk, for example `/var/data/shopco.sqlite`. The database must not be stored on an ephemeral filesystem.

For the Vercel frontend, set the runtime environment variable `SHOPCO_API_URL` to the origin of the deployed Express API, for example `https://shopco-api.example.com`. Explicit Vercel functions at `/api/auth/signup`, `/api/auth/login`, `/api/auth/me`, and `/api/auth/logout` proxy account requests and session cookies to that API, keeping the browser connection same-origin. Redeploy the Vercel project after adding or changing this variable.

## API

The Express service provides:

```text
POST /api/auth/signup
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/logout
```

Passwords are stored as salted hashes, and sessions are stored in SQLite.
