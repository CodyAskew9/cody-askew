import React from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import far1 from "../../assets/Home/far1.webp";
import far2 from "../../assets/Home/far2.webp";
import middle1 from "../../assets/Home/middle1.webp";
import middle2 from "../../assets/Home/middle2.webp";
import closest1 from "../../assets/Home/closest1.webp";
import closest2 from "../../assets/Home/closest2.webp";
import "./ParallaxHero.css";

/** Base plate under WebP layers — also shows while layers load */
const HERO_FALLBACK = `${process.env.PUBLIC_URL || ""}/fallback.png`;

/** Bottom → top stack (same order as desktop / fallback.png) */
const LAYERS = [
  { src: far2, speed: 0.1, id: "far2" },
  { src: far1, speed: 0.18, id: "far1" },
  { src: middle2, speed: 0.3, id: "middle2" },
  { src: middle1, speed: 0.42, id: "middle1", sparse: true },
  { src: closest2, speed: 0.58, id: "closest2", sparse: true },
  { src: closest1, speed: 0.75, id: "closest1", sparse: true },
];

function ParallaxLayer({ src, speed, scrollY, staticHero, layerId, sparse }) {
  const y = useTransform(scrollY, (v) => v * speed);

  return (
    <motion.div
      className={`parallax-hero__layer parallax-hero__layer--${layerId}${sparse ? " parallax-hero__layer--sparse" : ""}`}
      style={{
        backgroundImage: `url(${src})`,
        y: staticHero ? 0 : y,
      }}
    >
      {sparse ? (
        <img className="parallax-hero__art" src={src} alt="" draggable={false} />
      ) : null}
    </motion.div>
  );
}

export default function ParallaxHero() {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();

  return (
    <div
      className={`parallax-hero${reduceMotion ? " parallax-hero--static" : ""}`}
      aria-hidden="true"
    >
      <div
        className="parallax-hero__fallback"
        style={{ backgroundImage: `url(${HERO_FALLBACK})` }}
      />
      {LAYERS.map((layer) => (
        <ParallaxLayer
          key={layer.id}
          layerId={layer.id}
          src={layer.src}
          speed={layer.speed}
          sparse={layer.sparse}
          scrollY={scrollY}
          staticHero={reduceMotion}
        />
      ))}
    </div>
  );
}
