import { Link } from "react-router-dom";
import "./page404.css";

export const Page404 = () => {
  const mobile404 = "/images/mobile404.webp";
  const desktop404 = "/images/desktop404.webp";

  // useEffect(() => {
  //   const mediaQuery = window.matchMedia("(orientation: portrait)");
  //   const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
  //     setIsPortrait(e.matches);
  //   };
  //   handleChange(mediaQuery);
  //   mediaQuery.addEventListener("change", handleChange);
  //   return () => {
  //     mediaQuery.removeEventListener("change", handleChange);
  //   };
  // }, []);

  return (
    <div className="not-found-wrapper">
      <picture>
        <source
          media="(orientation: portrait)"
          srcSet={mobile404}
        />

        <img
          src={desktop404}
          alt="404"
          className="not-found-image"
        />
      </picture>

      <Link
        to="/"
        className="not-found-link"
      />
    </div>
  );
};
