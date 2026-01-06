# NextWatch Server — environment & seeding

This document explains server environment variables and provides simple scripts to seed the MongoDB database for local development.

## Environment variables (important)

Create a `.env` file in `Server/MagicStreamServer/` (copy from `.env.example`) and set the values below:

- `MONGODB_URI` — MongoDB connection string (e.g., `mongodb://localhost:27017`)
- `DATABASE_NAME` — Database name (default in examples: `nextwatch`)
- `SECRET_KEY`, `SECRET_REFRESH_KEY` — JWT secrets
- `ALLOWED_ORIGINS` — Comma-separated list of allowed origins for CORS (e.g., `http://localhost:5173`)
- `OPENAI_API_KEY` — (Optional) OpenAI key used by the recommendation feature
- `BASE_PROMPT_TEMPLATE` — Prompt template for LangChain
- `RECOMMENDED_MOVIE_LIMIT` — Recommended movie count
- `COOKIE_SECURE` — Set `false` for local development (HTTP), `true` in production (HTTPS)
- `COOKIE_DOMAIN` — Domain used when writing cookies (default: `localhost`)

> Tip: For local development set `COOKIE_SECURE=false` and `COOKIE_DOMAIN=localhost` so cookies work over HTTP.

---

## Seeding the database (scripts)

Seed data is included under the repository folder `magic-stream-seed-data/`.

- PowerShell (Windows):

  ```powershell
  pwsh Server/MagicStreamServer/scripts/seed-db.ps1 -MongoUri "mongodb://localhost:27017" -DatabaseName "magicstream"
  ```

- Bash (macOS/Linux):

  ```bash
  bash Server/MagicStreamServer/scripts/seed-db.sh mongodb://localhost:27017 magicstream
  ```

Both scripts rely on the `mongoimport` CLI (part of MongoDB Database Tools). They will import `genres.json`, `movies.json`, `users.json`, and `rankings.json` into the specified database and `--drop` existing collections before import.

If you prefer a UI, use MongoDB Compass to import the provided JSON files.
