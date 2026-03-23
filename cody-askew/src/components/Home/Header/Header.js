import React, { useState } from "react";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Header.css";

const NAV_LINKS = [
  { id: "projects", label: "Projects" },
  // { id: "ai-assistant", label: "AI Assistant" }, // hidden while AI section is disabled
  { id: "ContactMe", label: "Contact" },
];

export default function Header() {
  const [showMenu, setShowMenu] = useState(false);

  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    setShowMenu(false);
  };

  const goHome = () => {
    const el = document.getElementById("Home");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    setShowMenu(false);
  };

  return (
    <header className="header-container">
      {showMenu ? (
        <button
          type="button"
          className="header-backdrop"
          aria-label="Close menu"
          onClick={() => setShowMenu(false)}
        />
      ) : null}
      <div className="header-parent">
        <button
          type="button"
          className="header-hamburger"
          aria-expanded={showMenu}
          aria-controls="site-nav-menu"
          onClick={() => setShowMenu(!showMenu)}
        >
          <FontAwesomeIcon className="header-hamburger-bars" icon={faBars} />
        </button>
        <button type="button" className="header-logo" onClick={goHome}>
          Cody Askew
        </button>
        <nav
          id="site-nav-menu"
          className={
            showMenu ? "header-options show-hamburger-options" : "header-options"
          }
          aria-label="Primary"
        >
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              type="button"
              className="header-option"
              onClick={() => scrollToId(link.id)}
            >
              {link.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
