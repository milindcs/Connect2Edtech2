import { Link, useLocation } from "react-router-dom";
import { Shield } from "lucide-react";
import logo from "../../assets/cc2e.png";
import { useMemo } from "react";


/* ====================================================================== */
/* NAVIGATION LINKS                                                       */
/* ====================================================================== */

export const NAV_LINKS = [
  {
    label: "Home",
    to: "/",
  },
  {
    label: "About",
    to: "/about",
  },
  {
    label: "Courses",
    to: "/courses",
  },
  {
    label: "Contact Us",
    to: "/contact",
  },
  {
    label: "Mentors",
    to: "/#mentors",
  },
  {
    label: "Become a Trainer",
    to: "/trainer-application",
  },
];


/* ====================================================================== */
/* NAVBAR                                                                 */
/* ====================================================================== */

function Navbar({ onMenuOpen }) {
  const location = useLocation();

  const isActive = useMemo(() => {
    return (to) => {
      if (to === "/") return location.pathname === "/";
      if (to.startsWith("/#")) {
        return location.pathname === "/" && location.hash === to.replace("/", "");
      }
      return location.pathname === to;
    };
  }, [location.pathname, location.hash]);

  return (
    <nav
      className="
        sticky
        top-0
        z-[1000]
        w-full
        bg-white
        border-b
        border-slate-100
        shadow-sm
      "
    >
      <div
        className="
          w-full
          max-w-7xl
          mx-auto
          pl-4
          pr-4
          sm:pl-6
          sm:pr-6
          md:pl-8
          md:pr-8
          flex
          flex-row
          items-center
          justify-between
          gap-4
          py-4
        "
      >
        {/* Logo */}
        <div className="flex items-center shrink-0">
          <Link
            to="/"
            aria-label="Connect2Edtech Home"
            className="flex items-center min-w-0 group transition-transform duration-200 hover:scale-105 active:scale-95"
          >
            <img
              src={logo}
              alt="Connect2Edtech Logo"
              className="w-10 h-10 sm:w-12 sm:h-12 object-contain shrink-0 max-w-none"
            />
            <span className="font-bold text-base sm:text-lg tracking-tight text-black ml-2 group-hover:text-black/80 transition-colors">
              Connect2Edtech
            </span>
          </Link>
        </div>

        {/* Desktop Navigation + Actions */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 ml-[30px]">
          {NAV_LINKS.map(({ label, to }) => (
            <Link
              key={label}
              to={to}
              className={`whitespace-nowrap text-[#2b3a4a] hover:text-pink-600 font-medium text-base transition-colors ${
                isActive(to) && label !== "Home"
                  ? "text-[#f0247a] font-semibold"
                  : ""
              }`}
            >
              {label}
            </Link>
          ))}
          <div className="w-px h-5 bg-slate-200" />
          <Link
            to="/admin/login"
            title="Admin Login"
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full border-2 border-[#f0247a] bg-white text-[#f0247a] text-sm font-medium whitespace-nowrap hover:bg-pink-50 transition-colors"
          >
            <Shield className="w-4 h-4" />
            Admin
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center text-[#2b3a4a] hover:text-pink-600 font-medium text-base transition-colors"
          >
            Login
          </Link>
          <Link
            to="/get-started"
            className="inline-flex items-center px-5 py-2 rounded-full bg-[#f0247a] text-white font-medium text-sm whitespace-nowrap shadow-md hover:bg-[#c41d63] transition-all"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            type="button"
            onClick={onMenuOpen}
            aria-label="Open navigation menu"
            className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 flex flex-col justify-center items-center w-10 h-10 gap-1 focus:outline-none"
          >
            <span className="w-5 h-0.5 bg-slate-800 rounded-full" />
            <span className="w-5 h-0.5 bg-slate-800 rounded-full" />
            <span className="w-5 h-0.5 bg-slate-800 rounded-full" />
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar;

