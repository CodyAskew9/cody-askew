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
    "Albuquerque full stack · SaaS depth (relational data, auth, RBAC, SOC 2 Type II). NFC isn’t a footnote—years shipping tags, readers, and physical→digital flows (Albuquerque NFC, 2017–2022).",
  chips: [
    "ABQ · NM",
    "Enterprise SaaS",
    "NFC · hardware",
    "Node · PostgreSQL · React",
  ],
};

/** Top-right: tools + forward-looking learning */
export const stackTile = {
  title: "THE STACK",
  learningLabel: "Currently learning",
  learningLines: [
    "RAG — retrieval-augmented generation",
    "Vertex AI — Gemini on Google Cloud",
  ],
};

export const techStack = [
  { label: "React", icon: "react" },
  { label: "Node.js", icon: "node" },
  { label: "Express", icon: "server" },
  { label: "PostgreSQL", icon: "database" },
  { label: "MongoDB", icon: "database" },
  { label: "JavaScript", icon: "js" },
  { label: "Python", icon: "python" },
  { label: "Jest", icon: "code" },
  { label: "Cypress", icon: "test" },
];

/** Middle row: proof — architecture first for scanning */
export const caseStudy = {
  title: "PROOF · ENTERPRISE SAAS",
  subtitle: "SaaS · NDA-safe summary",
  architectureLead: "How the system is wired — frontend to data",
  challenge:
    "Build a high-availability backend for complex relational HR data, secure authentication, and enterprise-grade access controls.",
  stack: "Node.js, Express, PostgreSQL, React",
  engineering: [
    {
      title: "Relational schema",
      text: "Normalized PostgreSQL design for roles, permissions, and reporting.",
    },
    {
      title: "RBAC",
      text: "Role-based access control across the API and application layer—JWT auth and middleware for role-gated routes.",
    },
    {
      title: "SOC 2 Type II",
      text: "Implemented controls and practices aligned with SOC 2 Type II—audit-ready security, access management, and operational safeguards.",
    },
  ],
  result:
    "A production-minded foundation: secure APIs, enforced access policies, and compliance-ready operations.",
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
      text: "Altura Prep (K–5) and Cod-IE (8+): Python, Scratch, Pygame, original curricula. Passionate about passing on knowledge and helping others learn.",
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
    {title: "Community", text: "I work with local organizations to help them build their websites and apps.", icon: "community"},
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
