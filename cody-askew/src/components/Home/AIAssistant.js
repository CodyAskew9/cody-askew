import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComments,
  faPaperPlane,
  faSpinner,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import "./AIAssistant.css";

function chatEndpoint() {
  const raw = (process.env.NEXT_PUBLIC_CHAT_API || "")
    .trim()
    .replace(/\/$/, "");
  if (!raw) return "/api/chat";
  if (/\/api\/chat$/i.test(raw)) return raw;
  if (/\/api$/i.test(raw)) return `${raw}/chat`;
  return `${raw}/api/chat`;
}

export default function AIAssistant() {
  const panelId = useId();
  const inputEmbedId = useId();
  const inputOverlayId = useId();
  const messagesEndRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [turns, setTurns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [turns, loading, open]);

  const send = async (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q || loading) return;

    setError("");
    setQuery("");
    setLoading(true);

    const history = turns.map(({ role, content }) => ({ role, content }));

    try {
      const { data } = await axios.post(
        chatEndpoint(),
        { message: q, history },
        { timeout: 60000 }
      );
      const reply =
        typeof data?.reply === "string" ? data.reply : "No response text.";
      setTurns((prev) => [
        ...prev,
        { role: "user", content: q },
        { role: "assistant", content: reply },
      ]);
    } catch (err) {
      const data = err.response?.data;
      const base =
        data?.error ||
        err.message ||
        "Request failed. Is the RAG server running?";
      const detail =
        data?.detail && typeof data.detail === "string"
          ? ` ${data.detail}`
          : "";
      setError(base + detail);
      setQuery(q);
    } finally {
      setLoading(false);
    }
  };

  const messageBlocks = (
    <>
      {turns.map((t, i) => (
        <div
          key={`${i}-${t.role}`}
          className={`ai-chat__turn ai-chat__turn--${t.role}`}
        >
          <p className="ai-chat__bubble">{t.content}</p>
        </div>
      ))}
      {loading ? (
        <div className="ai-chat__turn ai-chat__turn--assistant ai-chat__turn--loading">
          <p className="ai-chat__bubble ai-chat__bubble--loading">
            <FontAwesomeIcon icon={faSpinner} spin aria-hidden />
            <span>Thinking…</span>
          </p>
        </div>
      ) : null}
      <div ref={messagesEndRef} />
    </>
  );

  const chatPanel = (
    <div
      className="ai-chat ai-chat--overlay"
      id={panelId}
      role="dialog"
      aria-modal="true"
      aria-label="Cody's AI twin"
    >
      <div className="ai-chat__backdrop" onClick={close} aria-hidden="true" />
      <div className="ai-chat__sheet">
        <header className="ai-chat__head">
          <h2 className="ai-chat__title">Cody&apos;s AI twin</h2>
          <button
            type="button"
            className="ai-chat__close"
            onClick={close}
            aria-label="Close chat"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </header>
        <p className="ai-chat__hint">
          Uses{" "}
          <code className="ai-chat__code">Google Vertex AI</code> (Gemini; keyword
          filter on the knowledge base, no embedding calls). Set{" "}
          <code className="ai-chat__code">GOOGLE_CLOUD_PROJECT</code>
          , enable the Vertex AI API, then run{" "}
          <code className="ai-chat__code">gcloud auth application-default login</code>{" "}
          (required for Node; <code className="ai-chat__code">gcloud auth login</code>{" "}
          alone is not enough), then <code className="ai-chat__code">npm run dev</code>.
        </p>
        {error ? (
          <p className="ai-chat__error" role="alert">
            {error}
          </p>
        ) : null}
        <div className="ai-chat__messages" aria-live="polite">
          {turns.length === 0 && !loading ? (
            <p className="ai-chat__placeholder">
              Try: &ldquo;Does Cody know PostgreSQL?&rdquo;
            </p>
          ) : null}
          {messageBlocks}
        </div>
        <form className="ai-chat__form" onSubmit={send}>
          <label className="visually-hidden" htmlFor={inputOverlayId}>
            Ask me anything about Cody&apos;s work
          </label>
          <input
            id={inputOverlayId}
            className="ai-chat__input"
            type="text"
            autoComplete="off"
            placeholder="Ask me anything about Cody's work."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            className="ai-chat__send"
            aria-label="Send"
            disabled={loading || !query.trim()}
          >
            <FontAwesomeIcon icon={loading ? faSpinner : faPaperPlane} spin={loading} />
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      <section
        className="ai-assistant"
        id="ai-assistant"
        aria-label="AI assistant"
      >
        <div className="ai-assistant__inner">
          <h2 className="ai-assistant__heading">Cody&apos;s AI twin</h2>
          <p className="ai-assistant__sub">
            Keyword-filtered knowledge base + Vertex AI (Gemini) — run{" "}
            <code className="ai-chat__code">npm run dev</code> locally or deploy
            the server with GCP credentials (see <code>.env.example</code>).
          </p>
          {error ? (
            <p className="ai-assistant__error" role="alert">
              {error}
            </p>
          ) : null}
          <div className="ai-assistant__embed">
            <div className="ai-chat ai-chat--embedded" aria-hidden={false}>
              <div className="ai-chat__messages ai-chat__messages--embed">
                {turns.length === 0 && !loading ? (
                  <p className="ai-chat__placeholder">
                    Try: &ldquo;Summarize Cody&apos;s NFC experience.&rdquo;
                  </p>
                ) : null}
                {messageBlocks}
              </div>
              <form className="ai-chat__form" onSubmit={send}>
                <label className="visually-hidden" htmlFor={inputEmbedId}>
                  Ask me anything about Cody&apos;s work
                </label>
                <input
                  id={inputEmbedId}
                  className="ai-chat__input"
                  type="text"
                  autoComplete="off"
                  placeholder="Ask me anything about Cody's work."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="submit"
                  className="ai-chat__send"
                  aria-label="Send"
                  disabled={loading || !query.trim()}
                >
                  <FontAwesomeIcon
                    icon={loading ? faSpinner : faPaperPlane}
                    spin={loading}
                  />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <button
        type="button"
        className="ai-fab"
        aria-label="Open AI assistant"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(true)}
      >
        <FontAwesomeIcon icon={faComments} />
      </button>

      {open && typeof document !== "undefined"
        ? createPortal(chatPanel, document.body)
        : null}
    </>
  );
}
