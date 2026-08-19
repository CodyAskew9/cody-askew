import React, { useEffect, useRef, useState } from "react";
import TypeAnimation from "react-type-animation";
import axios from "axios";

import imgBack from "../../../src/images/mailz.jpeg";
import ScreenHeading from "../../utilitys/ScreenHeading/ScreenHeading";
import ScrollService from "../../utilitys/scrollService";
import Animations from "../../utilitys/Animations";
import Footer from "../../components/Footer/Footer";
import SiteFooter from "../Home/Footer/Footer";
import "./ContactMe.css";

function contactEndpoint() {
  const raw = (
    process.env.REACT_APP_CONTACT_API ||
    process.env.REACT_APP_CHAT_API ||
    ""
  )
    .trim()
    .replace(/\/$/, "");
  if (!raw) return "/api/contact";
  if (/\/api\/contact$/i.test(raw)) return raw;
  if (/\/api$/i.test(raw)) return `${raw}/contact`;
  return `${raw}/api/contact`;
}

export default function ContactUs(props) {
  useEffect(() => {
    const sub = ScrollService.currentScreenFadeIn.subscribe((screen) => {
      if (screen.fadeInScreen !== props.id) return;
      Animations.animations.fadeInScreen(props.id);
    });
    return () => sub.unsubscribe();
  }, [props.id]);

  /* Contact is the only fade-in screen; reveal on mount so it isn’t stuck at opacity 0 */
  useEffect(() => {
    if (props.id) Animations.animations.fadeInScreen(props.id);
  }, [props.id]);

  const form = useRef();
  const [status, setStatus] = useState("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const sendEmail = async (e) => {
    e.preventDefault();
    if (!form.current) return;

    const fd = new FormData(form.current);
    const fromName = String(fd.get("from_name") || "").trim();
    const email = String(fd.get("user_email") || "").trim();
    const message = String(fd.get("message") || "").trim();

    if (!fromName || !email || !message) {
      setStatus("error");
      setStatusMessage("Please fill in name, email, and message.");
      return;
    }

    setStatus("sending");
    setStatusMessage("Sending…");
    try {
      await axios.post(
        contactEndpoint(),
        {
          fromName,
          userEmail: email,
          message,
        },
        { timeout: 15000 }
      );
      setStatus("success");
      setStatusMessage("Thanks — your message was sent. I'll get back to you soon.");
      form.current.reset();
    } catch (err) {
      setStatus("error");
      const data = err?.response?.data;
      const statusCode = err?.response?.status;
      const detail =
        data?.error ||
        (statusCode ? `Request failed with status ${statusCode}.` : "") ||
        err?.message ||
        "Something went wrong. Try again or email me on LinkedIn.";
      setStatusMessage(detail);
      console.error("[ContactMe] contact API", err);
    }
  };

  return (
    <div className="main-container fade-in" id={props.id || ""}>
      <ScreenHeading subHeading={"Lets Keep In Touch"} title={"Contact Me"} />
      <div className="central-form">
        <div className="col">
          <h2 className="title">
            <TypeAnimation
              cursor={false}
              sequence={["Get In Touch 📧", 1000, ""]}
            />
          </h2>{" "}
          <a href="https://github.com/CodyAskew9">
            <i className="fa fa-github-square" />
          </a>
          <a href="https://www.linkedin.com/in/codyaskew/">
            <i className="fa fa-linkedin-square" />
          </a>
        </div>
        <div className="back-form">
          <div className="img-back">
            <h4>Send Your Email Here!</h4>
            <img src={imgBack} alt="" />
          </div>
          <form ref={form} onSubmit={sendEmail} noValidate>
            <label htmlFor="contact-name">Your name</label>
            <input
              id="contact-name"
              type="text"
              name="from_name"
              autoComplete="name"
              required
            />

            <label htmlFor="contact-email">Email</label>
            <input
              id="contact-email"
              type="email"
              name="user_email"
              autoComplete="email"
              required
            />

            <label htmlFor="contact-message">Message</label>
            <textarea
              id="contact-message"
              name="message"
              rows={5}
              required
            />

            {statusMessage ? (
              <p
                className={`contact-form__status contact-form__status--${status}`}
                role="status"
                aria-live="polite"
              >
                {statusMessage}
              </p>
            ) : null}

            <div className="send-btn">
              <button type="submit" disabled={status === "sending"}>
                {status === "sending" ? "Sending…" : "Send"}
                <i className="fa fa-paper-plane" aria-hidden />
              </button>
            </div>
          </form>
        </div>
      </div>
      <SiteFooter />
      <Footer />
    </div>
  );
}
