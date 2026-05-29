import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Sun, Moon } from "lucide-react";
import logo from "../assets/logo_vibrant.png";
import { useTheme } from "../context/ThemeContext";

const Header = ({ user, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const currentPage = location.pathname;

  const handleNavClick = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    onLogout();
    setMobileMenuOpen(false);
  };

  const goToDashboard = () => {
    if (user?.userType === "startup") {
      handleNavClick("/dashboard/startup");
    } else if (user?.userType === "admin") {
      handleNavClick("/dashboard/admin");
    } else {
      handleNavClick("/dashboard/fresher");
    }
  };

  const navLinkClass = (path) =>
    `${
      currentPage === path
        ? "text-brandOrange"
        : "text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
    } transition-colors font-medium`;

  return (
    <header className="w-full fixed top-0 left-0 right-0 flex items-center justify-between py-3 px-6 md:px-8 xl:px-15 bg-white/80 dark:bg-background/80 backdrop-blur-md border-b border-gray-200 dark:border-white/5 z-30 transition-colors duration-300">
      {/* Logo */}
       <div
                   className="flex items-center gap-2 sm:gap-4 md:gap-3 group cursor-pointer"
                   onClick={() => handleNavClick("/")}
                 >
                   <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 bg-gradient-to-br from-brandBlue via-brandOrange to-brandGreen p-[2px] rounded-xl lg:rounded-2xl shadow-xl group-hover:scale-105 transition-transform duration-300">
                     <div className="w-full h-full bg-white rounded-[10px] lg:rounded-[15px] flex items-center justify-center overflow-hidden">
                       <img
                         src={logo}
                         alt="FoundersFuel"
                         className="w-full h-full object-contain  dark:brightness-110"
                       />
                     </div>
                   </div>
                   <div className="flex flex-col justify-center">
                     <span className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-black tracking-tighter flex items-center leading-none">
                       <span className="text-gray-900 dark:text-white">
                         Founders
                       </span>
                       <span className="text-brandOrange">Fuel</span>
                     </span>
                     <span className="text-[8px] md:text-[10px] lg:text-[12px] uppercase tracking-[0.2em] md:tracking-[0.3em] text-gray-500 dark:text-gray-400 font-bold mt-0.5 md:mt-1.5 ml-0.5">
                       Fueling Innovation
                     </span>
                   </div>
                 </div>

      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center gap-8 sm:gap-4 lg:gap-12 xl:gap-15">
        <button
          onClick={() => handleNavClick("/")}
          className={navLinkClass("/")}
        >
          Home
        </button>
        <button
          onClick={() => handleNavClick("/about")}
          className={navLinkClass("/about")}
        >
          About
        </button>
        <button
          onClick={() => handleNavClick("/contact")}
          className={navLinkClass("/contact")}
        >
          Contact
        </button>

        {user ? (
          <>
            <button
              onClick={goToDashboard}
              className="text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-medium"
            >
              Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="px-6 py-2 rounded-lg border border-red-400/40 text-red-500 dark:text-red-400 hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-300 transition-all font-medium"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => handleNavClick("/login")}
              className={navLinkClass("/login")}
            >
              Login
            </button>
            <button
              onClick={() => handleNavClick("/register")}
              className="px-6 py-2 rounded-lg border border-purple-600 dark:border-purple-300 text-purple-600 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-brandPurple-light transition-all"
            >
              Get Started
            </button>
          </>
        )}

        {/* Theme Toggle  */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:border-gray-400 dark:hover:border-white/30 transition-all"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={18} className="animate-bounce" /> : <Moon size={18} className="animate-bounce" />}
        </button>
      </nav>

      {/* Mobile Right — theme toggle + hamburger */}
      <div className="md:hidden flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={18} className="animate-bounce" /> : <Moon size={18} className="animate-bounce" />}
        </button>
        <button
          className="text-gray-500 dark:text-gray-300 p-2 z-30"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-10 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute top-20 left-0 right-0 bg-white dark:bg-background border-b border-gray-200 dark:border-white/10 flex flex-col gap-4 p-6 md:hidden z-20 transition-colors duration-300">
            <button
              onClick={() => handleNavClick("/")}
              className={`${currentPage === "/" ? "text-brandOrange" : "text-gray-500 dark:text-gray-300"} text-left hover:text-gray-900 dark:hover:text-white transition-colors font-medium`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick("/about")}
              className={`${currentPage === "/about" ? "text-brandOrange" : "text-gray-500 dark:text-gray-300"} text-left hover:text-gray-900 dark:hover:text-white transition-colors font-medium`}
            >
              About
            </button>
            <button
              onClick={() => handleNavClick("/contact")}
              className={`${currentPage === "/contact" ? "text-brandOrange" : "text-gray-500 dark:text-gray-300"} text-left hover:text-gray-900 dark:hover:text-white transition-colors font-medium`}
            >
              Contact
            </button>

            {user ? (
              <>
                <button
                  onClick={goToDashboard}
                  className="text-gray-500 dark:text-gray-300 text-left hover:text-gray-900 dark:hover:text-white transition-colors font-medium"
                >
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="text-left text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleNavClick("/login")}
                  className={`${currentPage === "/login" ? "text-brandOrange" : "text-gray-500 dark:text-gray-300"} text-left hover:text-gray-900 dark:hover:text-white transition-colors font-medium`}
                >
                  Login
                </button>
                <button
                  onClick={() => handleNavClick("/register")}
                  className="px-6 py-2 rounded-lg border border-brandPurple-light text-purple-600 dark:text-purple-300 hover:bg-brandPurple-light hover:text-white transition-all text-left"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
