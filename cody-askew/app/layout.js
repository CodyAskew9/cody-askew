import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "../src/app.css";
import "../src/index.css";

config.autoAddCss = false;

export const metadata = {
  title: "Cody Askew",
  description:
    "Albuquerque full stack developer — SaaS, Node.js, PostgreSQL, React, and NFC.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/logo192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/logo192.png",
  },
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#1B1B2F",
  colorScheme: "dark",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
