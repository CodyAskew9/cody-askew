export const hero = {
  name: "Cody Askew",
  role: "Full Stack Developer",
  location: "Albuquerque, New Mexico",
};

export const aboutSection = {
  kicker: "About me",
  title: "The Albuquerque Architect",
};

/** Top-left hero tile: location + SaaS + NFC in one punch */
export const punch = {
  title: "THE PUNCH",
  body:
    "Albuquerque full stack · SaaS depth from RedshiftHR (relational data, auth, dashboard state). NFC isn’t a footnote—years shipping tags, readers, and physical→digital flows (Albuquerque NFC, 2017–2022).",
  chips: [
    "ABQ · NM",
    "RedshiftHR",
    "NFC · hardware",
    "Node · PostgreSQL · React",
  ],
};

/** Top-right: tools + forward-looking learning */
export const stackTile = {
  title: "THE STACK",
  learningLabel: "Currently learning",
  learningLines: [
    "Browser-Use AI — agentic browser automation",
    "Redux at scale · test coverage in production UIs",
  ],
};

export const techStack = [
  { label: "React", icon: "react" },
  { label: "Node.js", icon: "node" },
  { label: "PostgreSQL", icon: "database" },
  { label: "MongoDB", icon: "database" },
  { label: "Jest", icon: "js" },
  { label: "Python", icon: "python" },
];

/** Middle row: proof — architecture first for scanning */
export const caseStudy = {
  title: "PROOF · REDSHIFTHR",
  subtitle: "SaaS · NDA-safe summary",
  architectureLead: "How the system is wired — frontend to data",
  challenge:
    "Build a high-availability backend for complex relational HR data, secure authentication, and a responsive dashboard experience.",
  stack: "Node.js, Express, PostgreSQL, Redux on the client",
  engineering: [
    {
      title: "Relational schema",
      text: "Normalized PostgreSQL design for roles, permissions, and reporting.",
    },
    {
      title: "State on the client",
      text: "Redux for predictable dashboard updates and fewer redundant API calls.",
    },
    {
      title: "API surface",
      text: "Express REST + JWT and RBAC middleware for role-gated routes.",
    },
  ],
  result:
    "A production-minded foundation: secure APIs, clear data model, and UI state that scales with the product.",
  flow: [
    { label: "Frontend", icon: "laptop" },
    { label: "Node API", icon: "server" },
    { label: "PostgreSQL", icon: "database" },
  ],
};

/** Bottom-right niche tile */
export const innovation = {
  title: "NFC INTEGRATION",
  kicker: "THE INNOVATION",
  body:
    "Albuquerque NFC (2017–2022): sold & programmed tags/readers—tap → digital flow. Closed 2022; still shapes how I scope APIs, auth, and real-world edge cases.",
};

export const beyond = {
  title: "BEYOND THE CODE",
  items: [
    {
      title: "Teaching",
      text: "Altura Prep (K–5) and Cod-IE (8+): Python, Scratch, Pygame, original curricula.",
      icon: "graduation",
    },
    {
      title: "Tech & NFC",
      text: "Wearables, NFC, and hands-on hardware—former NFC business owner (2017–2022); still follows where physical meets digital.",
      icon: "microchip",
    },
    {
      title: "Gaming",
      text: "Story-driven worlds and creative builds.",
      icon: "gamepad",
    },
  ],
};

export const hardware = {
  title: "HARDWARE → SOFTWARE",
  body:
    "Founded Albuquerque NFC (2017–2022): sold and programmed NFC products bridging physical tags and digital experiences. Business closed in 2022; experience informs how I scope and ship software today.",
};

export const social = {
  github: "https://github.com/CodyAskew9",
  linkedin: "https://www.linkedin.com/in/codyaskew/",
};

/** Set to your NFC / digital business card URL when available */
export const nfc = {
  label: "Scan NFC",
  url: "#",
};
