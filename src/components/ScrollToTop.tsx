import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

export const ScrollToTop = () => {
  const { pathname } = useLocation();
  const navType = useNavigationType();

  useEffect(() => {
    if (navType !== "POP") {
      // Scroll both window and the app's main scrollable container
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
      const main = document.querySelector("main");
      if (main) main.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    }
  }, [pathname, navType]);

  return null;
};
