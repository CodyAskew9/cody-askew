import React from "react";

import "../Home/Home.css";
import Header from "./Header/Header";
import ParallaxHero from "./ParallaxHero";
import HeroIntro from "./HeroIntro";
import BentoGrid from "./BentoGrid";
// import AIAssistant from "./AIAssistant"; // Vertex AI twin — uncomment when ready to ship the chat API

export default function Home(props) {
  return (
    <div className="home-container" id={props.id || ""}>
      <div className="home-hero">
        <ParallaxHero />
        <div className="home-hero__chrome">
          <Header />
        </div>
        <div className="home-hero__content">
          <HeroIntro />
          <BentoGrid />
        </div>
      </div>
      {/* <AIAssistant /> */}
    </div>
  );
}
