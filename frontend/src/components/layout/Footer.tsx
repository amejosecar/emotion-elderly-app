// src/components/layout/Footer.tsx
import React from "react";

const Footer: React.FC = () => (
  <footer
    style={{
      textAlign: "center",
      padding: "1rem 0",
      borderTop: "1px solid #eaeaea",
      marginTop: "2rem",
    }}
  >
    <small>© {new Date().getFullYear()} Emotion Elderly</small>
  </footer>
);

export default Footer;
