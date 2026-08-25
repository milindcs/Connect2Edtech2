import { useEffect } from "react";
import { useLocation } from "react-router-dom";


/* ====================================================================== */
/* SCROLL TO HASH                                                         */
/* ====================================================================== */

function ScrollToHash() {
  const { pathname, hash } = useLocation();


  useEffect(() => {
    let cancelled = false;
    let timer = null;


    /* ================================================================ */
    /* HASH SCROLL                                                        */
    /* ================================================================ */

    if (hash) {
      const rawId = hash.replace(/^#/, "");

      let id;

      try {
        id = decodeURIComponent(rawId);
      } catch {
        id = rawId;
      }


      const scrollToTarget = () => {
        if (cancelled) return;

        const element = document.getElementById(id);

        if (!element) {
          return;
        }


        /* ------------------------------------------------------------ */
        /* Account for sticky navbar                                    */
        /* ------------------------------------------------------------ */

        const navbar =
          document.querySelector("nav.sticky") ||
          document.querySelector("nav");

        const navbarHeight =
          navbar?.getBoundingClientRect().height || 0;


        const extraSpacing = 16;

        const elementTop =
          element.getBoundingClientRect().top +
          window.scrollY;

        const targetPosition = Math.max(
          0,
          elementTop -
            navbarHeight -
            extraSpacing
        );


        window.scrollTo({
          top: targetPosition,
          left: 0,
          behavior: "smooth",
        });
      };


      /* -------------------------------------------------------------- */
      /* Wait for React content to render                                */
      /* -------------------------------------------------------------- */

      timer = window.setTimeout(() => {
        scrollToTarget();

        /*
         * A second attempt helps when the target section is rendered
         * slightly later because of lazy content, images, etc.
         */
        window.setTimeout(() => {
          scrollToTarget();
        }, 250);
      }, 50);


      /* -------------------------------------------------------------- */
      /* Cleanup                                                         */
      /* -------------------------------------------------------------- */

      return () => {
        cancelled = true;

        if (timer) {
          window.clearTimeout(timer);
        }
      };
    }


    /* ================================================================ */
    /* NORMAL ROUTE CHANGE                                               */
    /* ================================================================ */

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });


    return () => {
      cancelled = true;
    };
  }, [pathname, hash]);


  return null;
}


export default ScrollToHash;
