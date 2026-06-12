const { VertexAI } = require("@google-cloud/vertexai");

const CHUNKS = require("./knowledgeChunks");

/* Prefer a current GA model; override with VERTEX_CHAT_MODEL in .env if needed. */
const CHAT_MODEL =
  process.env.VERTEX_CHAT_MODEL || "gemini-2.0-flash-001";

/** @type {VertexAI | null} */
let vertexAI = null;

const SYSTEM_PROMPT = `You are the 'AI Twin' of Cody Askew. Your goal is to help recruiters understand Cody's technical expertise and work history.

Guidelines:

Tone: Professional, encouraging, and slightly witty (reflecting Cody's background as an educator).

Privacy: Never share Cody's phone number, personal email, or exact home address. If asked, tell them to reach out via the 'Contact' button on the site.

NDA Compliance: For confidential client work, speak only about the technical architecture (Node, Postgres, React, RBAC, SOC 2 Type II). Do not mention specific client names or proprietary business logic.

Constraint: If a question is asked that isn't in your knowledge base, say: 'That's a great question! I don't have that specific detail in my memory banks, but you can ask Cody directly via LinkedIn.'`;

const STOPWORDS = new Set([
  "a",
  "an",
  "the",
  "and",
  "or",
  "but",
  "in",
  "on",
  "at",
  "to",
  "for",
  "of",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "have",
  "has",
  "had",
  "do",
  "does",
  "did",
  "will",
  "would",
  "could",
  "should",
  "may",
  "might",
  "must",
  "can",
  "what",
  "which",
  "who",
  "whom",
  "this",
  "that",
  "these",
  "those",
  "how",
  "when",
  "where",
  "why",
  "if",
  "about",
  "with",
  "from",
  "into",
  "any",
  "some",
  "please",
  "tell",
  "me",
  "you",
  "your",
  "we",
  "they",
  "his",
  "him",
  "he",
  "she",
  "her",
  "it",
  "its",
  "i",
  "my",
  "am",
  "as",
  "by",
  "so",
  "than",
  "too",
  "very",
  "just",
  "also",
  "only",
  "even",
  "not",
  "no",
  "yes",
  "get",
  "got",
  "make",
  "made",
  "work",
  "working",
  "works",
  "job",
  "jobs",
  "role",
  "roles",
  "hire",
  "hiring",
  "recruiter",
  "recruiters",
]);

function getProjectId() {
  const p =
    process.env.GOOGLE_CLOUD_PROJECT ||
    process.env.GCLOUD_PROJECT ||
    process.env.GCP_PROJECT;
  return p && String(p).trim() ? String(p).trim() : "";
}

function getLocation() {
  return (process.env.VERTEX_LOCATION || "us-central1").trim();
}

function ensureVertexConfig() {
  const project = getProjectId();
  if (!project) {
    const err = new Error(
      "Set GOOGLE_CLOUD_PROJECT (or GCLOUD_PROJECT) for Vertex AI"
    );
    err.code = "NO_VERTEX_CONFIG";
    throw err;
  }
  return { project, location: getLocation() };
}

function getVertexAI() {
  const { project, location } = ensureVertexConfig();
  if (!vertexAI) {
    vertexAI = new VertexAI({ project, location });
  }
  return vertexAI;
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Tokens used for cheap keyword matching (no embeddings).
 * @param {string} query
 * @returns {string[]}
 */
function extractSearchTokens(query) {
  const raw = query
    .toLowerCase()
    .replace(/[^a-z0-9+#\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  const out = new Set();
  for (let w of raw) {
    w = w.replace(/\.(js|io)$/, "");
    if (w.length < 2) continue;
    if (STOPWORDS.has(w)) continue;
    out.add(w);
  }
  return [...out];
}

/**
 * @param {string} chunkLower
 * @param {string} token
 */
function tokenMatchesChunk(chunkLower, token) {
  if (token.length >= 5) {
    return chunkLower.includes(token);
  }
  return new RegExp(`\\b${escapeRegex(token)}\\b`, "i").test(chunkLower);
}

/**
 * @param {string} chunk
 * @param {string[]} tokens
 * @param {string} queryLower
 */
function scoreChunk(chunk, tokens, queryLower) {
  const lower = chunk.toLowerCase();
  let score = 0;
  for (const t of tokens) {
    if (tokenMatchesChunk(lower, t)) score += 1;
  }
  if (/\bk\s*[-]?\s*5\b/i.test(queryLower) && /\bk\s*[-]?\s*5\b/i.test(lower)) {
    score += 1;
  }
  if (/\b8\s*\+\b|\bage\s*8\b|\b8\s*and\s*up\b/i.test(queryLower)) {
    if (/\b8\s*\+\b|\bstudents\s*8\+/i.test(lower)) score += 1;
  }
  return score;
}

/**
 * Keyword filter: only chunks that share tokens with the user message are sent to the model.
 * @param {string} query
 * @param {number} topK
 */
async function retrieve(query, topK = 5) {
  const queryLower = query.toLowerCase();
  const tokens = extractSearchTokens(query);
  const scored = CHUNKS.map((text) => ({
    text,
    score: scoreChunk(text, tokens, queryLower),
    tie: tiebreakWeight(text, tokens, queryLower),
  }))
    .filter((x) => x.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.tie !== a.tie) return b.tie - a.tie;
      return a.text.length - b.text.length;
    })
    .slice(0, topK);
  return scored.map((s) => s.text);
}

/**
 * Prefer chunks that match longer / more specific query tokens when scores tie.
 * @param {string} chunk
 * @param {string[]} tokens
 * @param {string} queryLower
 */
function tiebreakWeight(chunk, tokens, queryLower) {
  const lower = chunk.toLowerCase();
  let w = 0;
  for (const t of tokens) {
    if (tokenMatchesChunk(lower, t)) w += t.length;
  }
  if (/\bk\s*[-]?\s*5\b/i.test(queryLower) && /\bk\s*[-]?\s*5\b/i.test(lower)) {
    w += 6;
  }
  if (/\b8\s*\+\b|\bage\s*8\b|\b8\s*and\s*up\b/i.test(queryLower)) {
    if (/\b8\s*\+\b|\bstudents\s*8\+/i.test(lower)) w += 6;
  }
  return w;
}

function extractTextFromResponse(result) {
  const parts = result?.response?.candidates?.[0]?.content?.parts;
  if (!parts?.length) {
    const block = result?.response?.promptFeedback?.blockReason;
    throw new Error(
      block ? `Blocked: ${block}` : "Empty model response from Vertex AI"
    );
  }
  return parts.map((p) => p.text || "").join("").trim();
}

/**
 * @param {string} userMessage
 * @param {{ role: string, content: string }[]} history prior turns only
 */
async function chat(userMessage, history = []) {
  const v = getVertexAI();

  const contextChunks = await retrieve(userMessage, 5);
  const contextBlock =
    contextChunks.length > 0
      ? contextChunks.join("\n\n")
      : "No passages matched the user's keywords. Do not invent facts; follow the Constraint.";

  const systemText = `${SYSTEM_PROMPT}

Retrieved knowledge (keyword-matched only — base factual answers on this text):
${contextBlock}`;

  const generativeModel = v.getGenerativeModel({
    model: CHAT_MODEL,
    systemInstruction: {
      role: "system",
      parts: [{ text: systemText }],
    },
    generationConfig: {
      maxOutputTokens: 512,
      temperature: 0.35,
    },
  });

  const contents = [
    ...history
      .filter((m) => m.role === "user" || m.role === "assistant")
      .slice(-8)
      .map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: String(m.content).slice(0, 4000) }],
      })),
    { role: "user", parts: [{ text: userMessage.slice(0, 4000) }] },
  ];

  const result = await generativeModel.generateContent({ contents });
  const reply = extractTextFromResponse(result);
  if (!reply) throw new Error("Empty model response");
  return reply;
}

module.exports = { chat, retrieve, ensureVertexConfig };
