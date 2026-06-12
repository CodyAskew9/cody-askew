import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faReact,
  faNodeJs,
  faJs,
  faPython,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";
import {
  faDatabase,
  faCode,
  faGraduationCap,
  faMicrochip,
  faGamepad,
  faServer,
  faVial,
} from "@fortawesome/free-solid-svg-icons";
import ScreenHeading from "../../utilitys/ScreenHeading/ScreenHeading";
import ScrollService from "../../utilitys/scrollService";
import CaseStudyPanel from "../Home/CaseStudyPanel";
import {
  caseStudy,
  beyond,
  hardware,
  social,
  techStack,
} from "../../data/bentoContent";
import "../Home/BentoGrid.css";
import "./Resume.css";

const techIcons = {
  react: faReact,
  node: faNodeJs,
  js: faJs,
  python: faPython,
  database: faDatabase,
  code: faCode,
  server: faServer,
  test: faVial,
};

const beyondIcons = {
  graduation: faGraduationCap,
  microchip: faMicrochip,
  gamepad: faGamepad,
};

const experience = [
  {
    org: "Altura Preparatory School",
    role: "Coding Instructor · Grades K–5",
    range: "2023 – Present",
    text: "Delivers age-appropriate CS instruction; designs original curricula, differentiates by readiness, and keeps an engaging, inclusive classroom.",
  },
  {
    org: "Cod-IE (self-owned)",
    role: "Founder · Coding instruction (ages 8+)",
    range: "2022 – Present",
    text: "Python, Scratch, and Pygame; owns sequencing, projects, pacing, and family communication—entrepreneurship plus pedagogy.",
  },
  {
    org: "Albuquerque NFC",
    role: "Owner · Operator",
    range: "2017 – 2022",
    text: "Owned and operated an NFC product and programming business—scoping, delivery, and client work that paralleled software engineering discipline (business closed 2022).",
  },
  {
    org: "Vintage Motors",
    role: "Finance Manager",
    range: "2016 – 2017",
    text: "Financing and business development for a vintage auto dealership—networking, structured sales, clear customer communication.",
  },
  {
    org: "Auto dealerships (various)",
    role: "Internet sales · team coaching",
    range: "2012 – 2015",
    text: "Coached on product and incentives; owned digital and phone lead follow-up—higher satisfaction and conversion discipline.",
  },
];

const skillBars = [
  { skill: "React / Redux", pct: 90 },
  { skill: "JavaScript (ES6+)", pct: 88 },
  { skill: "Node.js / Express", pct: 84 },
  { skill: "PostgreSQL / SQL", pct: 82 },
  { skill: "MongoDB", pct: 82 },
  { skill: "Jest / Cypress", pct: 78 },
  { skill: "REST / Axios", pct: 86 },
  { skill: "HTML / CSS", pct: 88 },
  { skill: "Python (instruction)", pct: 76 },
];

const additionalProjects = [
  {
    title: "African Marketplace",
    meta: "2021 – 2022",
    line:
      "SMB marketplace—React, Styled Components, Axios CRUD; team of 4; Vercel & Heroku.",
  },
  {
    title: "Class Store",
    meta: "2022 – Present",
    line:
      "Classroom economy app in production with a teacher—React, Redux, MERN.",
  },
  {
    title: "Potluck Planner",
    meta: "Frontend",
    line: "Auth flows and polished planning UI—React & Styled Components.",
  },
  {
    title: "Keyless Remotes 4 Less",
    meta: "2022 – Present",
    line: "Small-business e-commerce—React, Bootstrap, MERN.",
  },
];

export default function Resume(props) {
  return (
    <div
      className="resume-container screen-container"
      id={props.id || ""}
    >
      <div className="resume-content">
        <ScreenHeading
          title="Resume"
          subHeading="Engineering · instruction · impact"
        />
        <div className="resume-bento-wrap">
          <div className="resume-bento-grid">
            <article className="bento-tile resume-tile resume-tile--work">
              <h2 className="bento-tile__title">EXPERIENCE</h2>
              <div className="resume-job-list">
                {experience.map((job) => (
                  <div className="resume-job" key={job.org}>
                    <div className="resume-job__head">
                      <h3 className="resume-job__org">{job.org}</h3>
                      <span className="resume-job__range">{job.range}</span>
                    </div>
                    <p className="resume-job__role">{job.role}</p>
                    <p className="resume-job__text">{job.text}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="bento-tile resume-tile resume-tile--skills">
              <h2 className="bento-tile__title">SKILL DEPTH</h2>
              <div className="resume-tech-icons">
                {techStack.map((t) => (
                  <div className="resume-tech-icons__cell" key={t.label}>
                    <FontAwesomeIcon
                      icon={techIcons[t.icon] || faCode}
                    />
                    <span>{t.label}</span>
                  </div>
                ))}
              </div>
              <div className="resume-skill-bars">
                {skillBars.map((s) => (
                  <div className="resume-skill-row" key={s.skill}>
                    <span className="resume-skill-row__label">{s.skill}</span>
                    <div className="resume-skill-row__track">
                      <div
                        className="resume-skill-row__fill"
                        style={{ width: `${s.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="bento-tile resume-tile resume-tile--github">
              <h2 className="bento-tile__title bento-tile__title--sm">
                GLOBAL COMMIT
              </h2>
              <a
                className="resume-github-link"
                href={social.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faGithub} size="3x" />
                <span>Open GitHub</span>
              </a>
            </article>

            <article
              className="bento-tile resume-tile resume-tile--flagship"
              id="proof"
            >
              <CaseStudyPanel caseStudy={caseStudy} centered>
                <button
                  type="button"
                  className="btn highlighted-btn resume-flagship-cta"
                  onClick={() =>
                    ScrollService.scrollHandler.scrollToHireMe()
                  }
                >
                  Let&apos;s talk
                </button>
              </CaseStudyPanel>
            </article>

            <article className="bento-tile resume-tile resume-tile--more">
              <h2 className="bento-tile__title">MORE BUILDS</h2>
              <div className="resume-mini-projects">
                {additionalProjects.map((p) => (
                  <div className="resume-mini-project" key={p.title}>
                    <div className="resume-mini-project__head">
                      <h3>{p.title}</h3>
                      <span>{p.meta}</span>
                    </div>
                    <p>{p.line}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="bento-tile resume-tile resume-tile--beyond">
              <h2 className="bento-tile__title">{beyond.title}</h2>
              <div className="bento-beyond">
                {beyond.items.map((item) => (
                  <div className="bento-beyond__item" key={item.title}>
                    <FontAwesomeIcon
                      icon={beyondIcons[item.icon] || faCode}
                      className="bento-beyond__icon"
                    />
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article
              className="bento-tile resume-tile resume-tile--nfc-visual"
              aria-label="NFC hardware accent"
            >
              <div className="bento-nfc-visual">
                <span className="bento-nfc-visual__ring" aria-hidden />
                <span className="bento-nfc-visual__chip" aria-hidden />
              </div>
            </article>

            <article className="bento-tile resume-tile resume-tile--hw">
              <h2 className="bento-tile__title bento-tile__title--sm">
                {hardware.title}
              </h2>
              <p className="bento-tile__body">{hardware.body}</p>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
}
