import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { social } from "../../../data/bentoContent";
import { RESUME_DOWNLOAD_NAME, RESUME_HREF } from "../../../data/site";
import "./Footer.css";

export default function Footer() {
  const resumeHref = RESUME_HREF;

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
          download={RESUME_DOWNLOAD_NAME}
          aria-label="Download résumé PDF"
        >
          <FontAwesomeIcon icon={faFilePdf} />
          <span className="site-footer__label">Résumé</span>
        </a>
      </div>
    </footer>
  );
}
