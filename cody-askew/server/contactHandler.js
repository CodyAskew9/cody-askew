const { Resend } = require("resend");
const {
  trimEnv,
  contactConfigured,
  isValidEmail,
  escapeHtml,
  isLikelyResendAuthFailure,
  publicResendError,
} = require("./util");

async function sendContact(rawBody) {
  const body = rawBody || {};
  const fromName = String(body.fromName || body.from_name || "").trim();
  const userEmail = String(body.userEmail || body.user_email || "").trim();
  const message = String(body.message || "").trim();

  if (!fromName || !userEmail || !message) {
    return { status: 400, json: { error: "Name, email, and message are required." } };
  }
  if (!isValidEmail(userEmail)) {
    return { status: 400, json: { error: "Please enter a valid email address." } };
  }
  if (fromName.length > 120 || userEmail.length > 320 || message.length > 5000) {
    return { status: 400, json: { error: "Message is too long." } };
  }
  if (!contactConfigured()) {
    return {
      status: 503,
      json: {
        error:
          "Contact email is not configured yet. Set RESEND_API_KEY and CONTACT_TO_EMAIL in cody-askew/.env (local) or Vercel environment variables (production).",
      },
    };
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
      return { status: 502, json: { error: publicResendError(error) } };
    }

    return { status: 200, json: { ok: true, id: data?.id || null } };
  } catch (err) {
    console.error("[api/contact]", err);
    if (isLikelyResendAuthFailure(err)) {
      return {
        status: 503,
        json: {
          error:
            "Contact email could not authenticate with Resend. Check RESEND_API_KEY and sender/domain verification.",
        },
      };
    }
    return {
      status: 500,
      json: { error: "Could not send your message right now. Please try again soon." },
    };
  }
}

async function handleContact(req, res) {
  const { readJsonBody } = require("./util");
  const result = await sendContact(readJsonBody(req));
  return res.status(result.status).json(result.json);
}

module.exports = { sendContact, handleContact };
