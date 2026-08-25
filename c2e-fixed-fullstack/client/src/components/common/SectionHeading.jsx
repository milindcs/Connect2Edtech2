// Shared section heading used throughout the homepage.
// Provides consistent title, accent punctuation, subtitle,
// and left / center / right alignment.

function SectionHeading({
  title,
  subtitle,
  align = "left",
  className = "",
}) {
  const alignmentStyles = {
    left: {
      wrapper: "items-start text-left",
      title: "text-left",
      subtitle: "text-left",
    },

    center: {
      wrapper: "items-center text-center",
      title: "text-center",
      subtitle: "text-center",
    },

    right: {
      wrapper: "items-end text-right",
      title: "text-right",
      subtitle: "text-right",
    },
  };

  const currentAlignment =
    alignmentStyles[align] || alignmentStyles.left;

  return (
    <div
      className={`
        w-full
        flex
        flex-col
        ${currentAlignment.wrapper}
        gap-2.5
        sm:gap-3
        md:gap-4
        ${className}
      `}
    >
      {/* ============================================================ */}
      {/* SECTION TITLE                                                 */}
      {/* ============================================================ */}

      <h2
        className={`
          w-full
          m-0
          p-0
          uppercase
          font-bold
          text-black
          leading-[1.1]
          tracking-[0.015em]
          ${currentAlignment.title}
        `}
        style={{
          fontSize: "clamp(1.25rem, 2.2vw, 1.75rem)",
        }}
      >
        {title}

        <span
          className="text-[#F0247A]"
          aria-hidden="true"
        >
          .
        </span>
      </h2>


      {/* ============================================================ */}
      {/* OPTIONAL SUBTITLE                                             */}
      {/* ============================================================ */}

      {subtitle && (
        <p
          className={`
            w-full
            max-w-xl
            m-0
            p-0
          text-black/75
          font-medium
          leading-relaxed
          tracking-wide
          ${currentAlignment.subtitle}
          `}
          style={{
            fontSize: "clamp(0.8rem, 1vw, 0.9rem)",
            lineHeight: 1.6,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default SectionHeading;
