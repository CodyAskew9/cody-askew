/**
 * Portfolio AI assistant API (Google Vertex AI + keyword-filtered knowledge base).
 * Run: npm run server (from cody-askew/) with ADC + project env.
 * Dev: CRA uses PORT from .env for the React dev server; this API uses SERVER_PORT (see .env.example).
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
const { Resend } = require("resend");
const { chat } = require("./rag");

/* SERVER_PORT: API port. Do not use PORT here — react-scripts uses PORT for :3000. */
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

function vertexReady() {
  const project =
    process.env.GOOGLE_CLOUD_PROJECT ||
    process.env.GCLOUD_PROJECT ||
    process.env.GCP_PROJECT;
  return Boolean(project && String(project).trim());
}

function isLikelyGoogleAuthFailure(err) {
  const s = `${err && err.name ? err.name : ""} ${err && err.message ? err.message : err}`.toLowerCase();
  return (
    s.includes("googleauth") ||
    s.includes("unable to authenticate") ||
    s.includes("could not load the default credentials") ||
    s.includes("application default credentials")
  );
}

function trimEnv(key, fallback = "") {
  const value = process.env[key];
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  return trimmed || fallback;
}

function contactConfigured() {
  return Boolean(trimEnv("RESEND_API_KEY") && trimEnv("CONTACT_TO_EMAIL"));
}

function isLikelyResendAuthFailure(err) {
  const s = `${err && err.name ? err.name : ""} ${err && err.message ? err.message : err}`.toLowerCase();
  return s.includes("api key") || s.includes("unauthorized") || s.includes("forbidden");
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    provider: "vertex-ai",
    vertexProjectConfigured: vertexReady(),
    contactConfigured: contactConfigured(),
  });
});

app.post("/api/contact", async (req, res) => {
  const rawBody = req.body || {};
  const fromName = String(rawBody.fromName || rawBody.from_name || "").trim();
  const userEmail = String(rawBody.userEmail || rawBody.user_email || "").trim();
  const message = String(rawBody.message || "").trim();

  if (!fromName || !userEmail || !message) {
    return res.status(400).json({ error: "Name, email, and message are required." });
  }
  if (!isValidEmail(userEmail)) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }
  if (fromName.length > 120 || userEmail.length > 320 || message.length > 5000) {
    return res.status(400).json({ error: "Message is too long." });
  }
  if (!contactConfigured()) {
    return res.status(503).json({
      error:
        "Contact email is not configured yet. Set RESEND_API_KEY and CONTACT_TO_EMAIL in cody-askew/.env.",
    });
  }

  try {
    const resend = new Resend(trimEnv("RESEND_API_KEY"));
    const fromAddress = trimEnv(
      "CONTACT_FROM_EMAIL",
      "Portfolio Contact <onboarding@resend.dev>"
    );
    const toAddress = trimEnv("CONTACT_TO_EMAIL");
    const subject = `Portfolio contact from ${fromName}`;
    const htmlMessage = escapeHtml(message).replace(/\r?\n/g, "<br/>");

    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: [toAddress],
      replyTo: userEmail,
      subject,
      text: `Name: ${fromName}\nEmail: ${userEmail}\n\n${message}`,
      html: `<p><strong>Name:</strong> ${escapeHtml(fromName)}</p><p><strong>Email:</strong> ${escapeHtml(
        userEmail
      )}</p><p><strong>Message:</strong></p><p>${htmlMessage}</p>`,
    });

    if (error) {
      console.error("[api/contact] resend response error", error);
      return res.status(502).json({
        error: "Email provider rejected the message. Please try again in a moment.",
      });
    }

    return res.json({ ok: true, id: data?.id || null });
  } catch (err) {
    console.error("[api/contact]", err);
    if (isLikelyResendAuthFailure(err)) {
      return res.status(503).json({
        error:
          "Contact email could not authenticate with Resend. Check RESEND_API_KEY and sender/domain verification.",
      });
    }
    return res.status(500).json({
      error: "Could not send your message right now. Please try again soon.",
    });
  }
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body || {};
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Missing message string" });
    }
    const trimmed = message.trim();
    if (!trimmed) {
      return res.status(400).json({ error: "Empty message" });
    }
    if (trimmed.length > 2000) {
      return res.status(400).json({ error: "Message too long" });
    }

    const hist = Array.isArray(history) ? history : [];

    const reply = await chat(trimmed, hist);
    res.json({ reply });
  } catch (e) {
    if (e.code === "NO_VERTEX_CONFIG") {
      return res.status(503).json({
        error:
          "Vertex AI is not configured. Set GOOGLE_CLOUD_PROJECT in cody-askew/.env, enable Vertex AI API, and use Application Default Credentials (gcloud auth application-default login or GOOGLE_APPLICATION_CREDENTIALS).",
      });
    }
    if (isLikelyGoogleAuthFailure(e)) {
      console.error("[api/chat] Application Default Credentials / auth failed", e);
      return res.status(503).json({
        error:
          "Vertex AI could not authenticate this machine. That is separate from `gcloud auth login`. Run: gcloud auth application-default login — sign in with the same Google account that owns project " +
          (vertexReady()
            ? (process.env.GOOGLE_CLOUD_PROJECT || "").trim() || "your GCP project"
            : "your GCP project") +
          ". Or set GOOGLE_APPLICATION_CREDENTIALS to a service account JSON key (see https://cloud.google.com/docs/authentication).",
        ...(process.env.NODE_ENV !== "production"
          ? { detail: e.message || String(e) }
          : {}),
      });
    }
    console.error("[api/chat]", e);
    const body = {
      error: "Could not complete the request. Try again in a moment.",
    };
    if (process.env.NODE_ENV !== "production") {
      body.detail = e.message || String(e);
    }
    res.status(500).json(body);
  }
});

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
