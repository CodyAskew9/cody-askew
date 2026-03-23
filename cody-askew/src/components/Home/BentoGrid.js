import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faReact,
  faNodeJs,
  faJs,
  faPython,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";
import { faDatabase, faCode, faLaptop } from "@fortawesome/free-solid-svg-icons";
import CaseStudyPanel from "./CaseStudyPanel";
import {
  aboutSection,
  punch,
  stackTile,
  techStack,
  caseStudy,
  innovation,
  social,
} from "../../data/bentoContent";
import "./BentoGrid.css";

const techIcons = {
  react: faReact,
  node: faNodeJs,
  js: faJs,
  python: faPython,
  database: faDatabase,
  code: faCode,
};

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
        <article className="bento-tile bento-tile--punch">
          <h3 className="bento-tile__title">{punch.title}</h3>
          <p className="bento-tile__body">{punch.body}</p>
          <ul className="bento-chips">
            {punch.chips.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          <p className="bento-punch__meta">
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
          <div className="bento-tile__accent" aria-hidden="true">
            <FontAwesomeIcon icon={faLaptop} />
          </div>
        </article>

        <article className="bento-tile bento-tile--stack">
          <h3 className="bento-tile__title">{stackTile.title}</h3>
          <div className="bento-tech">
            {techStack.map((t) => (
              <div className="bento-tech__cell" key={t.label}>
                <FontAwesomeIcon icon={techIcons[t.icon] || faCode} />
                <span>{t.label}</span>
              </div>
            ))}
          </div>
          <div className="bento-stack__learning">
            <p className="bento-stack__learning-label">
              {stackTile.learningLabel}
            </p>
            <ul className="bento-stack__learning-list">
              {stackTile.learningLines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        </article>

        <article className="bento-tile bento-tile--sage bento-tile--innovation">
          <p className="bento-innovation__kicker">{innovation.kicker}</p>
          <h3 className="bento-tile__title bento-innovation__title">
            {innovation.title}
          </h3>
          <div className="bento-innovation__layout">
            <div className="bento-innovation__visual" aria-hidden="true">
              <div className="bento-nfc-visual bento-nfc-visual--inline">
                <span className="bento-nfc-visual__ring" />
                <span className="bento-nfc-visual__chip" />
              </div>
            </div>
            <p className="bento-tile__body bento-innovation__body">
              {innovation.body}
            </p>
          </div>
        </article>

        <article className="bento-tile bento-tile--case" id="proof">
          <CaseStudyPanel caseStudy={caseStudy} emphasizeArchitecture>
            <button
              type="button"
              className="btn highlighted-btn bento-case__cta"
              onClick={scrollResume}
            >
              View full résumé
            </button>
          </CaseStudyPanel>
        </article>
      </div>
    </div>
  );
}
