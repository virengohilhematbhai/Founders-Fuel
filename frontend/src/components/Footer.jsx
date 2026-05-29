import logo from "../assets/logo_vibrant.png";
import { useNavigate } from "react-router-dom";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandTwitter,
  IconBrandWhatsapp,
  IconHeart,
} from "@tabler/icons-react";
import EmbeddedMap from "./Map";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const Footer = () => {
  const navigate = useNavigate();

  const handleNavClick = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  const locationRoute = useLocation();
  const [contextAddress, setContextAddress] = useState("");
  const [contextLocation, setContextLocation] = useState(null);
  const [contextName, setContextName] = useState("FoundersFuel HQ");

  useEffect(() => {
    const fetchContextAddress = async () => {
      const path = locationRoute.pathname;
      if (path.startsWith("/profile/")) {
        const userId = path.split("/")[2];
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/users/${userId}`);
          const data = await res.json();
          if (data.success && data.user) {
            setContextAddress(data.user.companyAddress || "");
            setContextLocation(data.user.location || null);
            setContextName(data.user.companyName || data.user.fullName);
            return;
          }
        } catch (err) {
          console.error("Error fetching context address:", err);
        }
      }

      // Default address
      setContextAddress("Innovation Hub, Gujrat, India");
      setContextLocation(null);
      setContextName("FoundersFuel HQ");
    };

    fetchContextAddress();
  }, [locationRoute.pathname]);

  return (
    <footer className="w-full px-6 md:px-12 xl:px-15  pt-20 pb-8 mt-auto border-t border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-[#080410] relative z-10 shrink-0 transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto">
        {/* Top Section: Staggered Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8 mb-16">
          {/* Col 1 - Logo & About */}
          <div className="flex flex-col">
            <div
              className="flex items-center justify-center sm:justify-start gap-4 mb-6 group cursor-pointer"
              onClick={() => handleNavClick("/")}
            >
              <div className="flex items-center justify-center w-12 h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 bg-gradient-to-br from-brandBlue via-brandOrange to-brandGreen p-[2px] rounded-xl lg:rounded-2xl shadow-xl transition-transform group-hover:scale-105 duration-300">
                <div className="w-full h-full bg-white rounded-[10px] lg:rounded-[15px] flex items-center justify-center overflow-hidden">
                  <img
                    src={logo}
                    alt="FoundersFuel"
                    className="w-full h-full object-contain p-1.5 md:p-2 dark:brightness-110"
                  />
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-xl lg:text-2xl xl:text-3xl font-black tracking-tighter flex items-center leading-none">
                  <span className="text-gray-900 dark:text-white">
                    Founders
                  </span>
                  <span className="text-brandOrange">Fuel</span>
                </span>
                <span className="text-[10px] lg:text-[12px] uppercase tracking-[0.2em] md:tracking-[0.3em] text-gray-500 dark:text-gray-400 font-bold mt-1 ml-0.5">
                  Fueling Innovation
                </span>
              </div>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-xs mx-auto sm:mx-0 text-center sm:text-left">
              Connecting visionaries with talent. We bridge the gap between pioneering startups and aspiring freshers to build the future together.
            </p>
           
          </div>

          {/* Col 2 - Center: Responsive Location */}
          <div className="flex flex-col items-center sm:items-start lg:items-center">
            <h4 className="text-gray-900 dark:text-white font-bold mb-6 tracking-wide uppercase text-sm">
              Our Location
            </h4>
            <div className="w-full h-[180px] max-w-full sm:max-w-sm rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-white/10">
              <EmbeddedMap
                address={contextAddress}
                companyName={contextName}
                location={contextLocation}
              />
            </div>
          </div>

          {/* Col 3 - Responsive Links Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:justify-end gap-x-8 gap-y-10 sm:col-span-2 lg:col-span-1">
            <div className="flex flex-col">
              <h4 className="text-gray-900 dark:text-white font-bold mb-6 tracking-wide text-sm whitespace-nowrap">
                PLATFORM
              </h4>
              <ul className="flex flex-col gap-4 text-sm text-gray-500 dark:text-[#887FB0]">
                <li>
                  <button onClick={() => handleNavClick("/")} className="hover:text-brandOrange transition-colors text-left truncate"> Home </button>
                </li>
                <li>
                  <button onClick={() => handleNavClick("/about")} className="hover:text-brandOrange transition-colors text-left truncate"> About </button>
                </li>
                <li>
                  <button onClick={() => handleNavClick("/contact")} className="hover:text-brandOrange transition-colors text-left truncate"> Contact </button>
                </li>
              </ul>
            </div>
            <div className="flex flex-col">
              <h4 className="text-gray-900 dark:text-white font-bold mb-6 tracking-wide text-sm whitespace-nowrap">
                JOIN AS
              </h4>
              <ul className="flex flex-col gap-4 text-sm text-gray-500 dark:text-[#887FB0]">
                <li>
                  <button onClick={() => handleNavClick("/register")} className="hover:text-brandOrange transition-colors text-left truncate"> Startup </button>
                </li>
                <li>
                  <button onClick={() => handleNavClick("/register")} className="hover:text-brandOrange transition-colors text-left truncate"> Fresher </button>
                </li>
              </ul>
            </div>
            <div className="flex flex-col col-span-2 sm:col-span-1">
              <h4 className="text-gray-900 dark:text-white font-bold mb-6 tracking-wide text-sm whitespace-nowrap">
                POLICY
              </h4>
              <ul className="flex flex-col gap-4 text-sm text-gray-500 dark:text-[#887FB0]">
                <li>
                  <button onClick={() => handleNavClick("/terms")} className="hover:text-brandOrange transition-colors text-left break-words"> Terms & Conditions </button>
                </li>
                <li>
                  <button onClick={() => handleNavClick("/privacy")} className="hover:text-brandOrange transition-colors text-left break-words"> Privacy Policy </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Middle Section: Centered Social Icons */}
        <div className="flex flex-col items-center justify-center border-t border-gray-300 dark:border-white/20 ">
          <div className="flex flex-col items-center justify-center border-b border-gray-300 dark:border-white/20 w-full pt-6 pb-6">
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 md:gap-16">
              <a
                href="#"
                className="p-2 bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all border border-gray-100 flex items-center justify-center group"
              >
                <IconBrandWhatsapp
                  size={40}
                  stroke={2}
                  style={{ color: "#25D366" }}
                />
              </a>
              <a
                href="#"
                className="p-2 bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all border border-gray-100 flex items-center justify-center group"
              >
                <IconBrandInstagram
                  size={40}
                  stroke={2}
                  style={{ color: "#E4405F" }}
                />
              </a>
              <a
                href="#"
                className="p-2 bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all border border-gray-100 flex items-center justify-center group"
              >
                <IconBrandLinkedin
                  size={40}
                  stroke={2}
                  style={{ color: "#0077b5" }}
                />
              </a>
              <a
                href="#"
                className="p-2 bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all border border-gray-100 flex items-center justify-center group"
              >
                <IconBrandFacebook
                  size={40}
                  stroke={2}
                  style={{ color: "#1877F2" }}
                />
              </a>
              <a
                href="#"
                className="p-2 bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all border border-gray-100 flex items-center justify-center group"
              >
                <IconBrandTwitter
                  size={40}
                  stroke={2}
                  style={{ color: "#1DA1F2" }}
                />
              </a>
            </div>
          </div>
        </div>
        {/* Bottom Bar: Copyright & Attribution */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 py-4">
          <div className="text-gray-500 dark:text-[#887FB0] text-sm font-medium">
            © 2026 FoundersFuel. All rights reserved.
          </div>
          <div className="text-gray-500 dark:text-[#887FB0] text-sm flex items-center gap-1.5 font-medium">
            Built with{" "}
            <IconHeart size={16} className="text-brandOrange fill-current" />{" "}
            for the startup ecosystem
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
