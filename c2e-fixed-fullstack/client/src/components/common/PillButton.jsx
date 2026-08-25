import { EASE } from "../../utils/animationVariants";

/* ====================================================================== */
/* BUTTON VARIANTS                                                        */
/* ====================================================================== */

const VARIANT_STYLES = {
  primary: `
    bg-[#F0247A]
    text-white
    focus-visible:ring-[#F0247A]
    hover:bg-[#DF1F70]
  `,

  secondary: `
    bg-[#111111]
    text-white
    focus-visible:ring-[#111111]
    hover:bg-[#222222]
  `,
};


/* ====================================================================== */
/* PILL BUTTON                                                             */
/* ====================================================================== */

function PillButton({
  children,
  href,
  onClick,
  variant = "primary",
  icon: Icon,
  className = "",
  type = "button",
  disabled = false,
  ariaLabel,
}) {
  const Component = href ? "a" : "button";

  const safeVariant =
    VARIANT_STYLES[variant] || VARIANT_STYLES.primary;


  return (
    <Component
      {...(href ? { href } : {})}
      {...(!href ? { type } : {})}
      onClick={onClick}
      disabled={!href ? disabled : undefined}
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
      style={{
        transitionTimingFunction: `cubic-bezier(${EASE.join(",")})`,
      }}
      className={`
        inline-flex
        items-center
        justify-center

        min-h-[38px]
        sm:min-h-[42px]

        min-w-[120px]
        sm:min-w-[135px]

        gap-2

        rounded-full

        px-4
        sm:px-5
        lg:px-6

        py-2
        sm:py-2.5

        text-[9px]
        sm:text-[10px]
        lg:text-[11px]

        font-semibold
        uppercase

        tracking-[0.06em]
        sm:tracking-[0.08em]

        leading-none

        text-center
        whitespace-nowrap

        transition-all
        duration-200

        hover:scale-[1.03]
        hover:brightness-110

        active:scale-[0.98]

        focus:outline-none
        focus-visible:ring-2
        focus-visible:ring-offset-2

        disabled:opacity-50
        disabled:cursor-not-allowed
        disabled:pointer-events-none

        ${safeVariant}
        ${className}
      `}
    >
      {/* ================================================================ */}
      {/* TEXT                                                              */}
      {/* ================================================================ */}

      <span
        className="
          inline-flex
          items-center
          justify-center
          leading-none
        "
      >
        {children}
      </span>


      {/* ================================================================ */}
      {/* ICON                                                              */}
      {/* ================================================================ */}

      {Icon && (
        <Icon
          aria-hidden="true"
          className="
            w-3
            h-3
            sm:w-3.5
            sm:h-3.5
            shrink-0
          "
          strokeWidth={2.2}
        />
      )}
    </Component>
  );
}

export default PillButton;
