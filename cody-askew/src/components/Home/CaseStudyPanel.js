import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDatabase,
  faCode,
  faLaptop,
  faServer,
} from "@fortawesome/free-solid-svg-icons";
import "./CaseStudyPanel.css";

const flowIcons = {
  laptop: faLaptop,
  server: faServer,
  database: faDatabase,
  code: faCode,
};

export default function CaseStudyPanel({
  caseStudy,
  children,
  centered,
  emphasizeArchitecture,
}) {
  const flowBlock = (
    <>
      {caseStudy.architectureLead ? (
        <p className="case-study__architecture">{caseStudy.architectureLead}</p>
      ) : null}
      <div
        className="bento-flow case-study__flow diagram-flow"
        role="img"
        aria-label="System flow from user frontend through Node API to PostgreSQL"
      >
        {caseStudy.flow.map((step, i) => (
          <React.Fragment key={step.label}>
            {i > 0 && <span className="bento-flow__arrow" aria-hidden />}
            <div className="bento-flow__step diagram-flow__step">
              <FontAwesomeIcon icon={flowIcons[step.icon] || faCode} />
              <span>{step.label}</span>
            </div>
          </React.Fragment>
        ))}
      </div>
    </>
  );

  const detailBlock = (
    <>
      <p className="bento-tile__body bento-tile__body--compact case-study__challenge">
        <strong>The challenge · </strong>
        {caseStudy.challenge}
      </p>
      <p className="case-study__stack">
        <strong>Stack · </strong>
        {caseStudy.stack}
      </p>
      <ul className="case-study__engineering">
        {caseStudy.engineering.map((item) => (
          <li key={item.title}>
            <span className="case-study__engineering-title">{item.title}</span>
            {item.text}
          </li>
        ))}
      </ul>
      <p className="case-study__result">
        <strong>Result · </strong>
        {caseStudy.result}
      </p>
    </>
  );

  return (
    <div className={centered ? "case-study case-study--centered" : "case-study"}>
      <h2 className="bento-tile__title">{caseStudy.title}</h2>
      <p className="case-study__subtitle">{caseStudy.subtitle}</p>
      {emphasizeArchitecture ? (
        <>
          {flowBlock}
          {detailBlock}
        </>
      ) : (
        <>
          {detailBlock}
          {flowBlock}
        </>
      )}
      {children ? (
        <div className="case-study__cta">{children}</div>
      ) : null}
    </div>
  );
}
