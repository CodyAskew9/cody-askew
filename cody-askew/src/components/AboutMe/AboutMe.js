import React from "react";
import ScreenHeading from "../../utilitys/ScreenHeading/ScreenHeading";
import ScrollService from "../../utilitys/scrollService";
import Animations from "../../utilitys/Animations";
import "./AboutMe.css";

export default function AboutMe(props) {
  let fadeInScreenHandler = (screen) => {
    if (screen.fadeScreen !== props.id) return;
    Animations.animations.fadeInScreen(props);
  };
  const fadeInSubscription =
    ScrollService.currentScreenFadeIn.subscribe(fadeInScreenHandler);
  const SCREEN_CONSTANTS = {
    description:
      "Full Stack Web Developer from the Albuquerque Area. Knowledgeable in MERN stack and a passion for improvement and growth.",
    highlights: {
      bullets: [
        "Fullstack Web Development",
        "React Components",
        "Redux State Management",
        "Building REST API",
        "Database Management",
      ],
      heading: "Here are a few of my Highlights:",
    },
  };
  const renderHighlights = () => {
    return SCREEN_CONSTANTS.highlights.bullets.map((value, i) => (
      <div className="highlight" key={i}>
        <div className="highlight-blob">
        </div>
          <span>{value}</span>
      </div>
    ));
  };

  return (
    <div className="about-me-container screen-container" id={props.id || ""}>
      <div className="about-me-parent">
        <ScreenHeading title={"About Me"} subHeading={"Why Choose Me"} />
        <div className="about-me-card">
          <div className="about-me-profile">
          </div>
            <div className="about-me-details">
              <span className="about-me-description">
                {SCREEN_CONSTANTS.description}
              </span>
              <div className="about-me-highlights">
                <div className="highlight-heading">
                  <span>{SCREEN_CONSTANTS.highlights.heading}</span>
                </div>
                {renderHighlights()}
              </div>
              <div className="about-me-options">
                <button className="btn primary-btn" onClick={() => ScrollService.scrollHandler.scrollToHireMe()}
>
                  {""}
                  Hire me{" "}
                </button>
                <a href={`${process.env.PUBLIC_URL}/Cody-Askew-Resume.pdf`} download="Cody-Askew-Resume.pdf">
                  <button className="btn highlighted-btn">Get Resume</button>
                </a>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
