import React, { useEffect, useRef, useState } from "react";
import TypeAnimation from "react-type-animation";
import emailjs from "@emailjs/browser";

import imgBack from "../../../src/images/mailz.jpeg";
import ScreenHeading from "../../utilitys/ScreenHeading/ScreenHeading";
import ScrollService from "../../utilitys/scrollService";
import Animations from "../../utilitys/Animations";
import Footer from "../../components/Footer/Footer";
import SiteFooter from "../Home/Footer/Footer";
import "./ContactMe.css";

function envTrim(key, fallback) {
  const v = process.env[key];
  if (v == null || typeof v !== "string") return fallback;
  const t = v.trim();
  return t === "" ? fallback : t;
}

const EMAILJS_SERVICE_ID = envTrim(
  "REACT_APP_EMAILJS_SERVICE_ID",
  "service_k1ml1d9"
);
const EMAILJS_TEMPLATE_ID = envTrim(
  "REACT_APP_EMAILJS_TEMPLATE_ID",
  "template_rn12bfn"
);
const EMAILJS_PUBLIC_KEY = envTrim(
  "REACT_APP_EMAILJS_PUBLIC_KEY",
  "nbD-qGep0doQ6e3no"
);
/** Matches {{to_name}} in your EmailJS template (“Hello {{to_name}},”). */
const EMAILJS_TO_NAME =
  process.env.REACT_APP_EMAILJS_TO_NAME || "Cody Askew";

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

  const sendEmail = (e) => {
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

    if (!EMAILJS_TEMPLATE_ID.startsWith("template_")) {
      setStatus("error");
      setStatusMessage(
        "EmailJS template ID is wrong: it must look like template_xxxx from https://dashboard.emailjs.com/admin/templates — not your public key."
      );
      return;
    }

    setStatus("sending");
    setStatusMessage("Sending…");

    /* Template: Hello {{to_name}}, … from {{user_email}}: {{message}} */
    const templateParams = {
      to_name: EMAILJS_TO_NAME,
      user_email: email,
      message: `From: ${fromName}\n\n${message}`,
    };

    emailjs
      .send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      )
      .then(
        () => {
          setStatus("success");
          setStatusMessage("Thanks — your message was sent. I'll get back to you soon.");
          form.current.reset();
        },
        (err) => {
          setStatus("error");
          const raw = err?.text || err?.message || "";
          let detail =
            raw || "Something went wrong. Try again or email me on LinkedIn.";
          if (/template.*not found|template id/i.test(String(raw))) {
            detail +=
              " Copy the Template ID from https://dashboard.emailjs.com/admin/templates into REACT_APP_EMAILJS_TEMPLATE_ID in .env (starts with template_).";
          }
          setStatusMessage(detail);
          console.error("[ContactMe] EmailJS", err);
        }
      );
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
