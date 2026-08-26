import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Link } from "react-router-dom";
import { NAV_LINKS } from "./Navbar.jsx";

function MobileMenu({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{
            duration: 0.25,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            fixed
            inset-0
            z-[60]
            w-full
            min-h-screen
            bg-white
            text-black
            overflow-y-auto
            overflow-x-hidden
          "
        >
          {/* ======================================================== */}
          {/* MOBILE NAVBAR                                             */}
          {/* ======================================================== */}

          <div
            className="
              w-full
              max-w-7xl
              mx-auto
              px-4
              sm:px-6
              md:px-8
              pt-5
              sm:pt-6
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
                w-full
                min-h-[44px]
              "
            >
              {/* ================================================== */}
              {/* LOGO                                                 */}
              {/* ================================================== */}

              <Link
                to="/"
                onClick={onClose}
                aria-label="Connect2Edtech home"
                className="
                  flex
                  items-center
                  justify-center
                  w-10
                  h-10
                  rounded-full
                  border-2
                  border-[#F0247A]
                  shrink-0
                  transition-transform
                  duration-200
                  hover:scale-105
                  focus:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#F0247A]
                  focus-visible:ring-offset-2
                "
              >
                <span
                  className="
                    w-3
                    h-3
                    rounded-full
                    bg-[#F0247A]
                  "
                />
              </Link>


              {/* ================================================== */}
              {/* CLOSE BUTTON                                         */}
              {/* ================================================== */}

              <button
                type="button"
                onClick={onClose}
                aria-label="Close navigation menu"
                className="
                  flex
                  items-center
                  justify-center
                  w-10
                  h-10
                  rounded-full
                  bg-black
                  text-white
                  shrink-0
                  transition-all
                  duration-200
                  hover:bg-[#F0247A]
                  hover:scale-105
                  active:scale-95
                  focus:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#F0247A]
                  focus-visible:ring-offset-2
                "
              >
                <X
                  size={19}
                  strokeWidth={2.2}
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>


          {/* ======================================================== */}
          {/* NAVIGATION LINKS                                          */}
          {/* ======================================================== */}

          <nav
            aria-label="Mobile navigation"
            className="
              w-full
              max-w-7xl
              mx-auto
              px-4
              sm:px-6
              md:px-8
              mt-12
              sm:mt-14
              md:mt-16
            "
          >
            <div
              className="
                flex
                flex-col
                gap-5
                sm:gap-6
              "
            >
              {NAV_LINKS.map(({ label, to }) => (
                <Link
                  key={label}
                  to={to}
                  onClick={onClose}
                  className="
                    inline-flex
                    items-center
                    w-fit
                    text-xl
                    sm:text-2xl
                    md:text-3xl
                    font-semibold
                    tracking-[0.12em]
                    uppercase
                    text-black
                    transition-all
                    duration-200
                    hover:text-[#F0247A]
                    hover:translate-x-1
                    focus:outline-none
                    focus-visible:text-[#F0247A]
                  "
                >
                  {label}
                </Link>
              ))}
            </div>
          </nav>


          {/* ======================================================== */}
          {/* BOTTOM / ADMIN                                            */}
          {/* ======================================================== */}

          <div
            className="
              w-full
              max-w-7xl
              mx-auto
              px-4
              sm:px-6
              md:px-8
              mt-12
              pb-8
            "
          >
            <div
              className="
                border-t
                border-black/10
                pt-6
                flex
                items-center
                justify-between
                gap-4
              "
            >
              <span
                className="
                  text-[10px]
                  sm:text-xs
                  uppercase
                  tracking-[0.12em]
                  text-gray-400
                "
              >
                Connect2Edtech
              </span>

              <Link
                to="/admin/login"
                onClick={onClose}
                className="
                  text-[10px]
                  sm:text-xs
                  font-semibold
                  tracking-[0.12em]
                  uppercase
                  text-gray-500
                  hover:text-[#F0247A]
                  transition-colors
                  focus:outline-none
                  focus-visible:text-[#F0247A]
                "
              >
                Admin Login
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default MobileMenu;
