import React from "react";
import "./footer.css"

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <p style={{margin: 0}}>
        © {currentYear} Quizzes for Everyone. All rights reserved.
      </p>
    </footer>
  );
};
