import { Link } from "react-router-dom";

const TABS = [
  {
    key: "all",
    label: "All",
    href: "/courses",
  },
  {
    key: "technical",
    label: "Technical",
    href: "/courses/technical",
  },
  {
    key: "non-technical",
    label: "Non-Technical",
    href: "/courses/non-technical",
  },
];

function CatalogToggle({ active, onSelect }) {
  return (
    <div className="flex justify-center w-full mb-6 sm:mb-8">
      <nav
        aria-label="Course categories"
        className="
          bg-slate-100
          border
          border-slate-200
          inline-flex
          items-center
          gap-1
          rounded-full
          p-1
          sm:p-1.5
          max-w-full
          overflow-x-auto
        "
      >
        {TABS.map((tab) => {
          const isActive = tab.key === active;

          const className = `
            shrink-0
            inline-flex
            items-center
            justify-center
            rounded-full
            px-3
            sm:px-5
            py-1.5
            sm:py-2
            text-[10px]
            sm:text-[11px]
            font-semibold
            uppercase
            tracking-[0.06em]
            whitespace-nowrap
            transition-all
            duration-300
            ${
              isActive
                ? `
                  text-white
                  bg-[#F0247A]
                  shadow-[4px_4px_10px_#cfcfcf,-4px_-4px_10px_#ffffff]
                  hover:bg-[#d91d6c]
                `
                : `
                  text-[#6b7280]
                  hover:text-[#111827]
                  hover:bg-white/50
                `
            }
          `;

          if (onSelect) {
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onSelect(tab.key)}
                aria-pressed={isActive}
                className={className}
              >
                {tab.label}
              </button>
            );
          }

          return (
            <Link
              key={tab.key}
              to={tab.href}
              aria-current={isActive ? "page" : undefined}
              className={className}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default CatalogToggle;
