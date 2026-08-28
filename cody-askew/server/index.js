/**
 * Portfolio AI assistant API (Google Vertex AI + keyword-filtered knowledge base).
 * Run: npm run server (from cody-askew/) with ADC + project env.
 * Dev: CRA uses PORT from .env for the React dev server; this API uses SERVER_PORT (see .env.example).
 * Production on Vercel uses /api/*.js functions that call the same handlers.
 */
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

/* Windows + Git Bash / npm: a closed non-TTY stdin can let the process exit even with a
   live HTTP server. Resume stdin so the dev server stays up under concurrently. */
if (process.platform === "win32") {
  process.stdin.on("error", () => {});
  try {
    process.stdin.resume();
  } catch (_) {
    /* ignore */
  }
}

const express = require("express");
const cors = require("cors");
const { handleContact } = require("./contactHandler");
const { handleChat, handleHealth } = require("./chatHandler");

/* SERVER_PORT: used when running `npm run server` (Express). Next.js uses `next dev` / `next start`. */
function getListenPort() {
  if (process.env.SERVER_PORT && String(process.env.SERVER_PORT).trim()) {
    const n = Number(process.env.SERVER_PORT);
    if (Number.isFinite(n) && n > 0) return n;
  }
  if (process.env.NODE_ENV === "production" && process.env.PORT) {
    const n = Number(process.env.PORT);
    if (Number.isFinite(n) && n > 0) return n;
  }
  return 5001;
}
const PORT = getListenPort();
const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || true }));
app.use(express.json({ limit: "40kb" }));

app.get("/api/health", handleHealth);
app.post("/api/contact", handleContact);
app.post("/api/chat", handleChat);

if (require.main === module) {
  const server = app.listen(PORT, () => {
    console.log(
      `API server (Vertex + Contact) http://localhost:${PORT}  (POST /api/chat, POST /api/contact)`
    );
  });

  server.on("error", (err) => {
    if (err && err.code === "EADDRINUSE") {
      console.error(
        `Port ${PORT} is already in use. Change SERVER_PORT in .env and package.json "proxy" to match.`
      );
    } else {
      console.error(err);
    }
    process.exit(1);
  });
}

module.exports = app;
