import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faReact,
  faNodeJs,
  faJs,
  faPython,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";
import { faDatabase, faServer, faCode, faVial } from "@fortawesome/free-solid-svg-icons";
import {
  aboutSection,
  social,
  stackTile,
  techStack,
} from "../../data/bentoContent";
import "./BentoGrid.css";

const techIcons = {
  react: faReact,
  node: faNodeJs,
  js: faJs,
  python: faPython,
  database: faDatabase,
  server: faServer,
  code: faCode,
  test: faVial,
};

const beyondItems = ["🐾 Animal Welfare", " ❤️ Family", "🎮 Gaming", "👥  Community"];

export default function BentoGrid() {
  const scrollToProof = () => {
    document.getElementById("proof")?.scrollIntoView({ behavior: "smooth" });
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
          <h3 className="bento-tile__title">{stackTile.title}</h3>
          <div className="bento-tech bento-tech--modern">
            {techStack.map((item) => (
              <div className="bento-tech__cell bento-tech__cell--modern" key={item.label}>
                <FontAwesomeIcon icon={techIcons[item.icon] || faCode} />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
          <div className="bento-stack__learning bento-stack__learning--modern">
            <p className="bento-stack__learning-label">{stackTile.learningLabel}</p>
            <ul className="bento-stack__learning-list">
              {stackTile.learningLines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        </article>

        <article className="bento-tile bento-tile--case-modern">
          <div className="bento-case-modern__content">
            <h3 className="bento-tile__title">Case Study: Enterprise SaaS</h3>
            <p className="bento-tile__body bento-case-modern__body">
              Architecting a secure, API-first SaaS platform with RBAC and SOC 2
              Type II compliance.
            </p>
            <button
              type="button"
              className="bento-case-modern__link"
              onClick={scrollToProof}
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
