import React from "react";
import TypeAnimation from 'react-type-animation';
import "./Profile.css"
import ScrollService from "../utilitys/scrollService";

export default function Profile() {
  return (
    <div className="profile-container">
      <div className="profile-parent">
        <div className="profile-details">
          <div className="colz">
              <div className="colz-icon">

            <a href="https://github.com/CodyAskew9">
              <i className="fa fa-github-square"></i>
            </a>
            
            <a href="https://www.linkedin.com/in/codyaskew/">
              <i className="fa fa-linkedin-square"></i>
            </a>
              </div>
          </div>
          <div className="profile-details-name">
              <span className="primary-text">
                  {""}
                  Hello, I'm <span className="highlighted-text">Cody Askew</span>
              </span>
          </div>
          <div className="profile-details-role">
              <span className="primary-text">
                  {""}
                  <h1>
                      {" "}
                      <TypeAnimation
      cursor={false}
      sequence={ [
                          "Ambitious Dev 📈",
                          1000,
                          "Full Stack Developer ✅",
                          1000,
                          "MERN Stack Developer 💻",
                          1000,
                          "Hard Working Dev 🦾",
                          1000,
                      ]} />
                  </h1>
                  <span className="profile-role-tagline">
                      Passionate about education and development in coding.
                  </span>
              </span>
          </div>
          <div className="profile-options">
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
  );
}
