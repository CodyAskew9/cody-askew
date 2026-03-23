import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import ScrollService from "../../utilitys/scrollService";
import { hero } from "../../data/bentoContent";
import "./HeroIntro.css";

const resumeHref = `${process.env.PUBLIC_URL || ""}/Cody-Askew-Resume.pdf`;

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.11, delayChildren: 0.12 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function HeroIntro() {
  const reduceMotion = useReducedMotion();

  const hire = () => {
    ScrollService.scrollHandler.scrollToHireMe();
  };

  if (reduceMotion) {
    return (
      <section
        className="home-hero__intro hero-intro-root"
        id="hero"
        aria-label="Introduction"
      >
        <div className="hero-intro">
          <h1 className="hero-intro__name">{hero.name}</h1>
          <p className="hero-intro__role">{hero.role}</p>
          <p className="hero-intro__location">{hero.location}</p>
          <div className="hero-intro__actions">
            <button
              type="button"
              className="hero-cta hero-cta--sage"
              onClick={hire}
            >
              Hire me
            </button>
            <a
              className="hero-cta hero-cta--outline"
              href={resumeHref}
              download="Cody-Askew-Resume.pdf"
              aria-label="Download résumé PDF"
            >
              Download résumé
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="home-hero__intro hero-intro-root"
      id="hero"
      aria-label="Introduction"
    >
      <motion.div
        className="hero-intro"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 className="hero-intro__name" variants={fadeUp}>
          {hero.name}
        </motion.h1>
        <motion.p className="hero-intro__role" variants={fadeUp}>
          {hero.role}
        </motion.p>
        <motion.p className="hero-intro__location" variants={fadeUp}>
          {hero.location}
        </motion.p>
        <motion.div className="hero-intro__actions" variants={fadeUp}>
          <motion.button
            type="button"
            className="hero-cta hero-cta--sage"
            onClick={hire}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            Hire me
          </motion.button>
          <motion.a
            className="hero-cta hero-cta--outline"
            href={resumeHref}
            download="Cody-Askew-Resume.pdf"
            aria-label="Download résumé PDF"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            Download résumé
          </motion.a>
        </motion.div>
        <motion.div
          className="hero-scroll-hint"
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.85 }}
          transition={{ delay: 0.85, duration: 0.5 }}
        >
          <span className="hero-scroll-hint__mouse">
            <span className="hero-scroll-hint__wheel" />
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}
