import { useEffect, useRef } from "react";
import gsap from "gsap";


/**
 * Reusable infinite marquee.
 *
 * Used for:
 * - Success Stories
 * - Hiring Partners
 * - Other horizontally scrolling content
 *
 * The items are rendered twice so that the second copy seamlessly
 * replaces the first copy when the animation reaches the loop point.
 */
function Marquee({
  items = [],
  speed = 60,
  gap = 24,
  className = "",
  itemClassName = "",
}) {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const groupRef = useRef(null);
  const tweenRef = useRef(null);


  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    const group = groupRef.current;

    if (!container || !track || !group || items.length === 0) {
      return undefined;
    }


    /* ================================================================ */
    /* REDUCED MOTION                                                   */
    /* ================================================================ */

    const mediaQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const getReducedMotion = () => mediaQuery.matches;


    /* ================================================================ */
    /* CLEANUP CURRENT ANIMATION                                        */
    /* ================================================================ */

    const killTween = () => {
      if (tweenRef.current) {
        tweenRef.current.kill();
        tweenRef.current = null;
      }
    };


    /* ================================================================ */
    /* BUILD MARQUEE                                                    */
    /* ================================================================ */

    const build = () => {
      killTween();

      gsap.set(track, {
        x: 0,
      });


      /* -------------------------------------------------------------- */
      /* Reduced motion                                                  */
      /* -------------------------------------------------------------- */

      if (getReducedMotion()) {
        return;
      }


      /* -------------------------------------------------------------- */
      /* Measure first item group                                        */
      /* -------------------------------------------------------------- */

      const groupWidth = group.getBoundingClientRect().width;

      if (!groupWidth || groupWidth <= 0) {
        return;
      }


      /* -------------------------------------------------------------- */
      /* Distance between identical positions                            */
      /* -------------------------------------------------------------- */

      const distance = groupWidth + gap;

      const safeSpeed =
        Number.isFinite(Number(speed)) && Number(speed) > 0
          ? Number(speed)
          : 60;

      const duration = distance / safeSpeed;


      /* -------------------------------------------------------------- */
      /* Infinite animation                                              */
      /* -------------------------------------------------------------- */

      tweenRef.current = gsap.to(track, {
        x: -distance,
        duration,
        ease: "none",
        repeat: -1,
      });
    };


    /* ================================================================ */
    /* INITIAL BUILD                                                     */
    /* ================================================================ */

    build();


    /* ================================================================ */
    /* RESIZE OBSERVER                                                    */
    /* ================================================================ */

    let resizeTimer;

    const scheduleBuild = () => {
      window.clearTimeout(resizeTimer);

      resizeTimer = window.setTimeout(() => {
        build();
      }, 100);
    };

    const resizeObserver = new ResizeObserver(scheduleBuild);

    resizeObserver.observe(container);


    /* ================================================================ */
    /* FONT LOADING                                                      */
    /* ================================================================ */

    let cancelled = false;

    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (!cancelled) {
          build();
        }
      });
    }


    /* ================================================================ */
    /* REDUCED MOTION CHANGES                                            */
    /* ================================================================ */

    const handleMotionChange = () => {
      build();
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener(
        "change",
        handleMotionChange
      );
    } else {
      mediaQuery.addListener(handleMotionChange);
    }


    /* ================================================================ */
    /* CLEANUP                                                           */
    /* ================================================================ */

    return () => {
      cancelled = true;

      window.clearTimeout(resizeTimer);

      resizeObserver.disconnect();

      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener(
          "change",
          handleMotionChange
        );
      } else {
        mediaQuery.removeListener(handleMotionChange);
      }

      killTween();

      gsap.set(track, {
        clearProps: "transform",
      });
    };
  }, [items, speed, gap]);


  /* ================================================================== */
  /* PAUSE / RESUME                                                     */
  /* ================================================================== */

  const pause = () => {
    tweenRef.current?.pause();
  };

  const resume = () => {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      tweenRef.current?.resume();
    }
  };


  /* ================================================================== */
  /* EMPTY STATE                                                        */
  /* ================================================================== */

  if (!items || items.length === 0) {
    return null;
  }


  /* ================================================================== */
  /* RENDER                                                             */
  /* ================================================================== */

  return (
    <div
      ref={containerRef}
      className={`w-full overflow-hidden ${className}`}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={pause}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          resume();
        }
      }}
    >
      <div
        ref={trackRef}
        className="flex w-max"
        style={{
          willChange: "transform",
        }}
      >

        {/* ============================================================ */}
        {/* FIRST GROUP                                                   */}
        {/* ============================================================ */}

        <div
          ref={groupRef}
          className="flex shrink-0"
          style={{
            gap: `${gap}px`,
          }}
        >
          {items.map((item, index) => (
            <div
              key={`marquee-a-${index}`}
              className={`shrink-0 ${itemClassName}`}
            >
              {item}
            </div>
          ))}
        </div>


        {/* ============================================================ */}
        {/* DUPLICATE GROUP                                               */}
        {/* ============================================================ */}

        <div
          className="flex shrink-0"
          aria-hidden="true"
          style={{
            gap: `${gap}px`,
            marginLeft: `${gap}px`,
          }}
        >
          {items.map((item, index) => (
            <div
              key={`marquee-b-${index}`}
              className={`shrink-0 ${itemClassName}`}
            >
              {item}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}


export default Marquee;
