import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import SectionHeading from "./SectionHeading.jsx";
import StatCard from "../sections/cards/StatCard.jsx";


/* ====================================================================== */
/* STATS DATA                                                             */
/* ====================================================================== */

const STATS = [
  {
    value: "13,000+",
    label: "Students Trained",
  },
  {
    value: "27+",
    label: "Partners",
  },
  {
    value: "97+",
    label: "Hiring Partners",
  },
  {
    value: "92%",
    label: "Placement Rate",
  },
];


/* ====================================================================== */
/* COUNT UP                                                               */
/* ====================================================================== */

function AnimatedNumber({ value, duration = 1600 }) {
  const ref = useRef(null);

  const isInView = useInView(ref, {
    once: true,
    amount: 0.5,
  });

  const [displayValue, setDisplayValue] = useState("0");


  useEffect(() => {
    if (!isInView) return;

    /* -------------------------------------------------------------- */
    /* Extract number and suffix                                      */
    /* -------------------------------------------------------------- */

    const numericValue = parseInt(
      String(value).replace(/[^0-9]/g, ""),
      10
    );

    const suffix = String(value).replace(/[0-9,]/g, "");

    if (Number.isNaN(numericValue)) {
      setDisplayValue(value);
      return;
    }


    /* -------------------------------------------------------------- */
    /* Animation                                                       */
    /* -------------------------------------------------------------- */

    let startTime = null;
    let animationFrame;


    const animate = (timestamp) => {
      if (!startTime) {
        startTime = timestamp;
      }

      const elapsed = timestamp - startTime;

      const progress = Math.min(
        elapsed / duration,
        1
      );


      /* Ease-out cubic */
      const eased =
        1 - Math.pow(1 - progress, 3);

      const currentValue = Math.floor(
        eased * numericValue
      );


      setDisplayValue(
        `${currentValue.toLocaleString("en-IN")}${suffix}`
      );


      if (progress < 1) {
        animationFrame =
          requestAnimationFrame(animate);
      } else {
        setDisplayValue(
          `${numericValue.toLocaleString("en-IN")}${suffix}`
        );
      }
    };


    animationFrame =
      requestAnimationFrame(animate);


    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isInView, value, duration]);


  return (
    <span
      ref={ref}
      className="
        inline-flex
        items-center
        justify-center
        min-w-[5ch]
        min-h-[1.2em]
      "
    >
      {displayValue}
    </span>
  );
}


/* ====================================================================== */
/* STATS SECTION                                                          */
/* ====================================================================== */

function StatsSection() {
  return (
    <motion.section
      className="
        w-full
        px-4
        sm:px-6
        md:px-8
        lg:px-12
        py-12
        sm:py-16
        md:py-20
        lg:py-24
      "
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        amount: 0.15,
      }}
      variants={{
        hidden: {
          opacity: 0,
        },

        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.12,
            delayChildren: 0.1,
          },
        },
      }}
    >

      {/* ============================================================ */}
      {/* HEADING                                                       */}
      {/* ============================================================ */}

      <div className="w-full flex justify-center">
        <SectionHeading
          title="OUR IMPACT"
          align="center"
          className="
            mb-8
            sm:mb-10
            md:mb-12
            max-w-2xl
          "
        />
      </div>


      {/* ============================================================ */}
      {/* STAT GRID                                                     */}
      {/* ============================================================ */}

      <div
        className="
          w-full
          max-w-6xl
          mx-auto

          grid
          grid-cols-2
          md:grid-cols-4

          items-stretch

          gap-3
          sm:gap-4
          md:gap-5
          lg:gap-6
        "
      >
        {STATS.map((stat, index) => (
          <motion.div
            key={stat.label}
            variants={{
              hidden: {
                opacity: 0,
                y: 25,
              },

              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                },
              },
            }}
            className="
              min-w-0
              h-full
            "
          >
            <StatCard
              value={
                <AnimatedNumber value={stat.value} />
              }
              label={stat.label}
              index={index}
            />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}


export default StatsSection;
