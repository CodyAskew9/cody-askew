import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faReact,
  faNodeJs,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";
import { faDatabase } from "@fortawesome/free-solid-svg-icons";
import {
  aboutSection,
  social,
} from "../../data/bentoContent";
import "./BentoGrid.css";

const techItems = [
  { label: "React", icon: faReact },
  { label: "Node.js", icon: faNodeJs },
  { label: "PostgreSQL", icon: faDatabase },
];

const beyondItems = ["🐾 Animal Welfare", "Family", "Gaming"];

export default function BentoGrid() {
  const scrollResume = () => {
    document.getElementById("Resume")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bento-wrap" id="projects">
      <header className="bento-section-head">
        <p className="bento-section__kicker">{aboutSection.kicker}</p>
        <h2 className="bento-section__title" id="about-heading">
          {aboutSection.title}
        </h2>
      </header>
      <div className="bento-grid">
        <article className="bento-tile bento-tile--bio">
          <h3 className="bento-tile__title">Me in a nutshell</h3>
          <p className="bento-bio__body">
            Software Engineer specializing in scalable SaaS solutions with
            Node.js and PostgreSQL, with a unique edge in NFC technology.
          </p>
          <p className="bento-punch__meta bento-punch__meta--bio">
            <a
              href={social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="bento-punch__github"
            >
              <FontAwesomeIcon icon={faGithub} aria-hidden />
              <span>Open GitHub</span>
            </a>
          </p>
        </article>

        <article className="bento-tile bento-tile--stack-modern">
          <h3 className="bento-tile__title">Tech Stack</h3>
          <div className="bento-tech bento-tech--modern">
            {techItems.map((item) => (
              <div className="bento-tech__cell bento-tech__cell--modern" key={item.label}>
                <FontAwesomeIcon icon={item.icon} />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="bento-tile bento-tile--case-modern" id="proof">
          <div className="bento-case-modern__content">
            <h3 className="bento-tile__title">Case Study: RedshiftHR</h3>
            <p className="bento-tile__body bento-case-modern__body">
              Architecting a secure, API-first SaaS platform for enterprise
              human resources.
            </p>
            <button
              type="button"
              className="bento-case-modern__link"
              onClick={scrollResume}
            >
              Explore Architecture
            </button>
          </div>
          <div className="bento-case-modern__glow" aria-hidden="true" />
        </article>

        <article className="bento-tile bento-tile--beyond-modern">
          <h3 className="bento-tile__title">Beyond the Code</h3>
          <ul className="bento-beyond-modern__list">
            {beyondItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>
    </div>
  );
}
