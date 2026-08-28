const { chat } = require("./rag");
const { vertexReady, isLikelyGoogleAuthFailure, healthPayload } = require("./util");

async function sendChat(rawBody) {
  try {
    const body = rawBody || {};
    const { message, history } = body;
    if (!message || typeof message !== "string") {
      return { status: 400, json: { error: "Missing message string" } };
    }
    const trimmed = message.trim();
    if (!trimmed) {
      return { status: 400, json: { error: "Empty message" } };
    }
    if (trimmed.length > 2000) {
      return { status: 400, json: { error: "Message too long" } };
    }

    const hist = Array.isArray(history) ? history : [];
    const reply = await chat(trimmed, hist);
    return { status: 200, json: { reply } };
  } catch (e) {
    if (e.code === "NO_VERTEX_CONFIG") {
      return {
        status: 503,
        json: {
          error:
            "Vertex AI is not configured. Set GOOGLE_CLOUD_PROJECT in cody-askew/.env, enable Vertex AI API, and use Application Default Credentials (gcloud auth application-default login or GOOGLE_APPLICATION_CREDENTIALS).",
        },
      };
    }
    if (isLikelyGoogleAuthFailure(e)) {
      console.error("[api/chat] Application Default Credentials / auth failed", e);
      return {
        status: 503,
        json: {
          error:
            "Vertex AI could not authenticate this machine. That is separate from `gcloud auth login`. Run: gcloud auth application-default login — sign in with the same Google account that owns project " +
            (vertexReady()
              ? (process.env.GOOGLE_CLOUD_PROJECT || "").trim() || "your GCP project"
              : "your GCP project") +
            ". Or set GOOGLE_APPLICATION_CREDENTIALS to a service account JSON key (see https://cloud.google.com/docs/authentication).",
          ...(process.env.NODE_ENV !== "production"
            ? { detail: e.message || String(e) }
            : {}),
        },
      };
    }
    console.error("[api/chat]", e);
    const json = {
      error: "Could not complete the request. Try again in a moment.",
    };
    if (process.env.NODE_ENV !== "production") {
      json.detail = e.message || String(e);
    }
    return { status: 500, json };
  }
}

async function handleChat(req, res) {
  const { readJsonBody } = require("./util");
  const result = await sendChat(readJsonBody(req));
  return res.status(result.status).json(result.json);
}

function handleHealth(_req, res) {
  return res.json(healthPayload());
}

module.exports = { sendChat, handleChat, handleHealth };
