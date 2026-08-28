function trimEnv(key, fallback = "") {
  const value = process.env[key];
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  return trimmed || fallback;
}

function vertexReady() {
  const project =
    process.env.GOOGLE_CLOUD_PROJECT ||
    process.env.GCLOUD_PROJECT ||
    process.env.GCP_PROJECT;
  return Boolean(project && String(project).trim());
}

function contactConfigured() {
  return Boolean(trimEnv("RESEND_API_KEY") && trimEnv("CONTACT_TO_EMAIL"));
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

function isLikelyGoogleAuthFailure(err) {
  const s = `${err && err.name ? err.name : ""} ${err && err.message ? err.message : err}`.toLowerCase();
  return (
    s.includes("googleauth") ||
    s.includes("unable to authenticate") ||
    s.includes("could not load the default credentials") ||
    s.includes("application default credentials")
  );
}

function isLikelyResendAuthFailure(err) {
  const s = `${err && err.name ? err.name : ""} ${err && err.message ? err.message : err}`.toLowerCase();
  return s.includes("api key") || s.includes("unauthorized") || s.includes("forbidden");
}

function healthPayload() {
  return {
    ok: true,
    provider: "vertex-ai",
    vertexProjectConfigured: vertexReady(),
    contactConfigured: contactConfigured(),
  };
}

function readJsonBody(req) {
  const raw = req.body;
  if (raw == null) return {};
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
  }
  if (Buffer.isBuffer(raw)) {
    try {
      return JSON.parse(raw.toString("utf8"));
    } catch {
      return {};
    }
  }
  return raw;
}

function publicResendError(error) {
  const msg = String((error && (error.message || error.error)) || "");
  const lower = msg.toLowerCase();
  if (
    lower.includes("only send testing emails") ||
    lower.includes("verify a domain") ||
    lower.includes("domain is not verified")
  ) {
    return "Resend rejected the sender. onboarding@resend.dev can only send to your Resend account email; production needs a verified domain.";
  }
  if (lower.includes("api key") || lower.includes("unauthorized") || lower.includes("invalid")) {
    return "Contact email could not authenticate with Resend. Check RESEND_API_KEY.";
  }
  return "Email provider rejected the message. Please try again in a moment.";
}

module.exports = {
  trimEnv,
  vertexReady,
  contactConfigured,
  isValidEmail,
  escapeHtml,
  isLikelyGoogleAuthFailure,
  isLikelyResendAuthFailure,
  healthPayload,
  readJsonBody,
  publicResendError,
};
