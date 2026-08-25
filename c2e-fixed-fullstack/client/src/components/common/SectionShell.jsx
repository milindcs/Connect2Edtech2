import { memo } from "react";

/**
 * Shared wrapper for homepage sections.
 *
 * tone="grey"
 *   → Floating light-grey rounded panel
 *
 * tone="white"
 *   → Full-width white section
 *
 * All section content is constrained to the same max-width so that
 * headings, cards and other homepage elements line up consistently.
 */

function SectionShell({
  tone = "white",
  className = "",
  children,
}) {
  const isGrey = tone === "grey";

  if (isGrey) {
    return (
      <section
        className={`
          w-full
          px-2
          sm:px-4
          md:px-6
          lg:px-8
          xl:px-10
          py-3
          sm:py-5
          md:py-7
        `}
      >
        <div
          className={`
            relative
            w-full
            max-w-[1500px]
            mx-auto

            rounded-[1.5rem]
            sm:rounded-[2rem]
            md:rounded-[2.5rem]
            lg:rounded-[3rem]

            bg-[#ECECEC]

            overflow-hidden

            ${className}
          `}
        >
          <div
            className="
              w-full
              max-w-[1400px]
              mx-auto
              px-4
              sm:px-6
              md:px-8
              lg:px-10
              xl:px-12
              py-8
              sm:py-10
              md:py-12
              lg:py-14
              xl:py-16
            "
          >
            {children}
          </div>
        </div>
      </section>
    );
  }


  /* ================================================================== */
  /* WHITE SECTION                                                       */
  /* ================================================================== */

  return (
    <section
      className={`
        w-full
        bg-white
        ${className}
      `}
    >
      <div
        className="
          w-full
          max-w-[1400px]
          mx-auto
          px-4
          sm:px-6
          md:px-8
          lg:px-10
          xl:px-12
          py-8
          sm:py-10
          md:py-12
          lg:py-14
          xl:py-16
        "
      >
        {children}
      </div>
    </section>
  );
}

export default memo(SectionShell);
