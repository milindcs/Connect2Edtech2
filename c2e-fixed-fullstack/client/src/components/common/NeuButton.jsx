import { EASE } from "../../utils/animationVariants";

/* ====================================================================== */
/* BUTTON VARIANTS                                                        */
/* ====================================================================== */

const VARIANT_STYLES = {
  primary: `
    text-white
    bg-[#F0247A]
    shadow-[6px_6px_14px_#cfcfcf,-6px_-6px_14px_#ffffff]
    hover:bg-[#df1f70]
    hover:shadow-[8px_8px_18px_#c7c7c7,-8px_-8px_18px_#ffffff]
    active:shadow-[inset_4px_4px_10px_#b91f5d,inset_-4px_-4px_10px_#ff79ae]
    focus-visible:ring-[#F0247A]
  `,

  secondary: `
    text-[#111827]
    bg-[#ECECEC]
    shadow-[6px_6px_14px_#cfcfcf,-6px_-6px_14px_#ffffff]
    hover:shadow-[8px_8px_18px_#c7c7c7,-8px_-8px_18px_#ffffff]
    active:shadow-[inset_4px_4px_10px_#cfcfcf,inset_-4px_-4px_10px_#ffffff]
    focus-visible:ring-[#111827]
  `,
};


/* ====================================================================== */
/* NEUMORPHIC BUTTON                                                      */
/* ====================================================================== */

function NeuButton({
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

        min-h-[44px]
        sm:min-h-[48px]

        min-w-[150px]
        sm:min-w-[160px]

        px-6
        sm:px-8
        lg:px-9

        py-3
        sm:py-3.5

        rounded-full

        text-[10px]
        sm:text-[11px]
        lg:text-xs

        font-semibold
        uppercase

        tracking-[0.08em]
        sm:tracking-[0.1em]

        leading-none

        text-center
        whitespace-nowrap

        gap-2

        transition-all
        duration-200

        active:translate-y-[1px]

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
      {/* BUTTON LABEL                                                     */}
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
      {/* OPTIONAL ICON                                                    */}
      {/* ================================================================ */}

      {Icon && (
        <Icon
          aria-hidden="true"
          className="
            w-3.5
            h-3.5
            sm:w-4
            sm:h-4
            shrink-0
          "
          strokeWidth={2.2}
        />
      )}
    </Component>
  );
}

export default NeuButton;
