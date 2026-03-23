import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import far1 from "../../assets/Home/far1.webp";
import far2 from "../../assets/Home/far2.webp";
import middle1 from "../../assets/Home/middle1.webp";
import middle2 from "../../assets/Home/middle2.webp";
import closest1 from "../../assets/Home/closest1.webp";
import closest2 from "../../assets/Home/closest2.webp";
import "./ParallaxHero.css";

const LAYERS = [
  { src: far2, speed: 0.1 },
  { src: far1, speed: 0.18 },
  { src: middle2, speed: 0.3 },
  { src: middle1, speed: 0.42 },
  { src: closest2, speed: 0.58 },
  { src: closest1, speed: 0.75 },
];

const MOBILE_HERO = middle1;

function ParallaxLayer({ src, speed }) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, (v) => v * speed);
  return (
    <motion.div
      className="parallax-hero__layer"
      style={{
        y,
        backgroundImage: `url(${src})`,
      }}
    />
  );
}

export default function ParallaxHero() {
  const reduceMotion = useReducedMotion();
  const [simple, setSimple] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setSimple(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  if (simple || reduceMotion) {
    return (
      <div
        className={`parallax-hero parallax-hero--simple${reduceMotion && !simple ? " parallax-hero--reduced" : ""}`}
        aria-hidden="true"
      >
        <div
          className="parallax-hero__single"
          style={{ backgroundImage: `url(${MOBILE_HERO})` }}
        />
      </div>
    );
  }

  return (
    <div className="parallax-hero" aria-hidden="true">
      {LAYERS.map((layer) => (
        <ParallaxLayer key={layer.src} src={layer.src} speed={layer.speed} />
      ))}
    </div>
  );
}
