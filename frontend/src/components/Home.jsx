import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Flame,
  GraduationCap,
  ArrowRight,
  Rocket,
  Search,
  Zap,
  TrendingUp,
} from "lucide-react";
import JobCard from "./JobCard";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col w-full">
      <section className="w-full flex-1 flex flex-col md:flex-row items-center justify-between px-6 md:px-12 xl:px-15 py-8 md:py-3 gap-8 md:gap-12">
        {/* Left Content */}
        <div className="flex-1 w-full max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2  md:mt-10 rounded-full border border-teal-200 dark:border-teal-900/50 bg-teal-50 dark:bg-teal-900/10 mb-5">
            <Flame className="w-4 h-4 animate-bounce text-brandOrange" fill="currentColor" />
            <span className="text-xs font-bold animate-pulse  tracking-widest text-teal-600 dark:text-[#B4E0E8]">
              THE STARTUP TALENT NETWORK
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white leading-[1.1] mb-6">
            Where <span className="text-brandOrange text-glow">Startups</span>
            <br />
            Meet Future
            <br />
            Talent
          </h1>

          <p className="text-lg text-gray-500 dark:text-gray-400 mb-10 max-w-lg leading-relaxed">
            FoundersFuel bridges the gap between innovative startups and
            ambitious freshers. Find real projects, build real experience,
            create real impact.
          </p>

          {/* New Search Section */}
          {/* <div className="flex flex-col gap-5 mb-12 max-w-xl">
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-400 group-focus-within:text-brandOrange transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Try 'React Developer' or 'AI Startup'..."
                className="w-full pl-12 pr-16 py-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brandOrange/50 focus:border-brandOrange transition-all text-gray-900 dark:text-white shadow-xl shadow-brandOrange/5"
              />
              <div className="absolute right-2 top-2">
                <button 
                  onClick={() => navigate("/register")}
                  className="px-4 py-2 bg-brandOrange text-black font-bold rounded-xl hover:bg-[#e65a25] transition-colors text-sm shadow-lg shadow-brandOrange/20"
                >
                  Search
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400 mr-2 flex items-center">
                Popular:
              </span>
              {["AI", "React", "TypeScript", "Remote", "UI/UX"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => navigate("/register")}
                  className="px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:border-brandOrange/40 hover:text-brandOrange transition-all"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div> */}

          <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
            <button
              onClick={() => navigate("/register")}
              className="w-full sm:w-auto  px-8 py-4 bg-brandOrange hover:bg-[#e65a25] text-black font-bold rounded-lg flex items-center justify-center gap-2 transition-transform hover:-translate-y-0.5"
            >
              Join as Fresher <GraduationCap className="w-5 h-5 " />
            </button>
            <button
              onClick={() => navigate("/register")}
              className="w-full sm:w-auto px-8 py-4 border border-brandPurple-light hover:bg-brandPurple-light/40 text-purple-600 dark:text-[#A89CD0] font-medium rounded-lg flex items-center justify-center gap-2 transition-transform hover:-translate-y-0.5"
            >
              Post a Project <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 animate-pulse md:grid-cols-4 gap-1">
            <div>
              <h4 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1">
                500+
              </h4>
              <p className="text-sm text-gray-400 font-medium tracking-wide">
                Startups
              </p>
            </div>
            <div>
              <h4 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1">
                12K+
              </h4>
              <p className="text-sm text-gray-400 font-medium tracking-wide">
                Freshers
              </p>
            </div>
            <div>
              <h4 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1">
                3K+
              </h4>
              <p className="text-sm text-gray-400 font-medium tracking-wide">
                Projects Posted
              </p>
            </div>
            <div>
              <h4 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1">
                8K+
              </h4>
              <p className="text-sm text-gray-400 font-medium tracking-wide">
                Placements
              </p>
            </div>
          </div>
        </div>

        {/* Right Content - Cards Showcase - hidden on mobile */}
        <div className="hidden md:flex flex-1 w-full relative min-h-[400px] items-center justify-center lg:justify-end">
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-64 h-64 bg-brandOrange/10 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute top-1/3 right-10 w-64 h-64 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="relative w-full max-w-lg -mt-40">
            {/* Top Card */}
            <div className="mb-16 ml-auto sm:-mr-8 lg:ml-20 pt-40 transform z-10 relative">
              <JobCard
                type="lightning"
                title="Frontend Developer Intern"
                company="TechFlow Startup"
                tags={[
                  {
                    label: "REACT",
                    url:"https://www.w3schools.com/react/default.asp",
                    colorClass:
                      "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 border border-purple-400 dark:border-purple-200/30",
                  },
                  {
                    label: "TYPESCRIPT",
                    url:"https://www.w3schools.com/typescript/index.php",
                    colorClass:
                      "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 border border-purple-400 dark:border-purple-200/30",
                  },
                  {
                    label: "ASP.NET",
                    url:"https://www.w3schools.com/asp/",
                    colorClass:
                      "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 border border-purple-400 dark:border-purple-200/30",
                  },
                ]}
              />
            </div>

            {/* Bottom Card */}
            <div  className="lg:ml-[-1rem] xl:ml-[-9rem] transform -translate-y-6">
              <JobCard
                onClick={() => navigate("/register")}
                type="bot"
                title="ML Engineer"
                company="AI Ventures Inc."
                tags={[
                  {
                    label: "OPEN",
                    url: "https://www.perplexity.ai/",
                    colorClass:
                      "bg-teal-400/30 text-teal-400 border border-teal-400",
                  },
                ]}
                extraInfo="3 months • ₹15k/m"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full px-6 md:px-12 xl:px-15 pt-10 pb-20">
        <div className="text-center mt-10 mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
            Everything you need to{" "}
            <span className="text-brandOrange relative inline-block pb-2">
              fuel growth
              <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-brandOrange to-pink-500 rounded-full blur-[2px]"></div>
              <div className="absolute bottom-[2px] left-0 w-full h-[1px] bg-gradient-to-r from-brandOrange to-pink-500"></div>
            </span>
          </h2>
          <p className="text-base md:text-lg text-gray-500 dark:text-[#887FB0] max-w-2xl mt-10 mx-auto font-medium">
            A complete platform built for the modern startup ecosystem
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-2">
          {/* Card 1 */}
          <div className="bg-gray-50 dark:bg-[#0f0b1a] border border-gray-200 dark:border-white/10 rounded-3xl p-8 flex flex-col items-center text-center transition-all duration-300 hover:border-brandOrange/50 hover:-translate-y-1">
            <div className="mb-6 opacity-70 group-hover:opacity-100 transition-opacity">
              <Rocket
                className="w-8 h-8 text-gray-500 dark:text-gray-300"
                strokeWidth={1.5}
              />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
              Post Projects
            </h3>
            <p className="text-sm text-gray-500 dark:text-[#887FB0] leading-relaxed">
              Startups post real projects and internships to find talented
              freshers who are ready to contribute.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-gray-50 dark:bg-[#0f0b1a] border border-gray-200 dark:border-white/10 rounded-3xl p-8 flex flex-col items-center text-center transition-all duration-300 hover:border-brandOrange/50 hover:-translate-y-1">
            <div className="mb-6 opacity-70 group-hover:opacity-100 transition-opacity">
              <Search
                className="w-8 h-8 text-brandOrange dark:text-orange "
                strokeWidth={1.5}
              />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
              Browse Opportunities
            </h3>
            <p className="text-sm text-gray-500 dark:text-[#887FB0] leading-relaxed">
              Freshers explore hundreds of live projects across domains and
              apply with just a few clicks.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-gray-50 dark:bg-[#0f0b1a] border border-gray-200 dark:border-white/10 rounded-3xl p-8 flex flex-col items-center text-center transition-all duration-300 hover:border-brandOrange/50 hover:-translate-y-1">
            <div className="mb-6 opacity-70 group-hover:opacity-100 transition-opacity">
              <Zap
                className="w-8 h-8 text-gray-500 dark:text-gray-300"
                strokeWidth={1.5}
                fill="none"
              />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
              Fast Matching
            </h3>
            <p className="text-sm text-gray-500 dark:text-[#887FB0] leading-relaxed">
              Smart filtering by domain, type, and skills ensures both sides
              find the perfect fit quickly.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-gray-50 dark:bg-[#0f0b1a] border border-gray-200 dark:border-white/10 rounded-3xl p-8 flex flex-col items-center text-center transition-all duration-300 hover:border-brandOrange/50 hover:-translate-y-1">
            <div className="mb-6 opacity-70 group-hover:opacity-100 transition-opacity">
              <TrendingUp
                className="w-8 h-8 text-brandOrange dark:text-orange"
                strokeWidth={1.5}
              />
            </div>
            <h3 className="text-lg font-bold text-Orange dark:text-white mb-3">
              Track Everything
            </h3>
            <p className="text-sm text-gray-500 dark:text-[#887FB0] leading-relaxed">
              Manage applications, review candidates, and track statuses all
              from a clean dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-auto px-6 md:px-12 xl:px-25 py-20">
        <div className="w-auto bg-gray-50 dark:bg-[#0a0f1c] border border-gray-200 dark:border-white/20 rounded-[2rem] p-10 md:p-16 text-center relative overflow-hidden mb-5">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-32 bg-brandOrange/10 blur-[80px] rounded-full pointer-events-none"></div>

          <h2 className="text-4xl md:text-5xl lg:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight relative z-10">
            Ready to{" "}
            <span className="text-brandOrange drop-shadow-[0_0_20px_rgba(255,107,53,0.5)]">
              launch?
            </span>
          </h2>
          <p className="text-base md:text-lg text-gray-500 dark:text-[#887FB0] max-w-xl mx-auto mb-10 font-medium relative z-10">
            Join thousands of startups and freshers already building the future
            together.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <button
              onClick={() => navigate("/register")}
              className="w-full sm:w-auto px-8 py-3.5 bg-brandOrange hover:bg-[#e65a25] text-[#0f0b1a] font-bold rounded-lg transition-all hover:-translate-y-0.5"
            >
              Create Free Account
            </button>
            <button
              onClick={() => navigate("/about")}
              className="w-full sm:w-auto px-12 py-3.5 bg-transparent border border-gray-300 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-gray-300 font-medium rounded-lg transition-all hover:-translate-y-0.5"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
