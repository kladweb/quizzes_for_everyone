import { useEffect, useState } from "react";
import "./scrollUp.css";

export const ScrollUp = () => {
  const coords = window.innerHeight * 0.5;
  const [show, changeShow] = useState(false);


  useEffect(
    () => {
      document.addEventListener('scroll', checkScroll);
      return () => {
        document.removeEventListener('scroll', checkScroll);
      };
    },
    [show]
  );

  function checkScroll() {
    const scrolled = window.scrollY;
    if (coords < scrolled && !show) {
      changeShow(true);
    }
    if (coords > scrolled && show) {
      changeShow(false);
    }
  }

  function scrollPage() {
    const scrolled = window.scrollY;
    window.scrollBy({
      top: -scrolled,
      left: 0,
      behavior: "smooth",
    });
    // window.scrollBy(0, -scrolled);
  }

  return (
    <div className={`scroll-div${show ? "" : " to-show"}`} onClick={scrollPage}>
      <span className="scroll-icon">↑</span>
    </div>
  );
}
