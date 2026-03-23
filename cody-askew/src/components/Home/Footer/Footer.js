import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faFilePdf, faWifi } from "@fortawesome/free-solid-svg-icons";
import { social, nfc } from "../../../data/bentoContent";
import "./Footer.css";

export default function Footer() {
  const resumeHref = `${process.env.PUBLIC_URL}/Cody-Askew-Resume.pdf`;

  return (
    <footer className="site-footer" aria-label="Site footer">
      <div className="site-footer__inner">
        <a
          className="site-footer__link"
          href={social.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <FontAwesomeIcon icon={faLinkedin} />
          <span className="site-footer__label">LinkedIn</span>
        </a>
        <a
          className="site-footer__link"
          href={social.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
        >
          <FontAwesomeIcon icon={faGithub} />
          <span className="site-footer__label">GitHub</span>
        </a>
        <a
          className="site-footer__link"
          href={resumeHref}
          download="Cody-Askew-Resume.pdf"
          aria-label="Download résumé PDF"
        >
          <FontAwesomeIcon icon={faFilePdf} />
          <span className="site-footer__label">Résumé</span>
        </a>
        <a
          className="site-footer__link site-footer__link--nfc"
          href={nfc.url}
          onClick={(e) => {
            if (!nfc.url || nfc.url === "#") e.preventDefault();
          }}
          aria-label={nfc.label}
          title="Programmable NFC or digital card URL"
        >
          <FontAwesomeIcon icon={faWifi} />
          <span className="site-footer__label">Scan NFC</span>
        </a>
      </div>
    </footer>
  );
}
