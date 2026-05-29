import React from "react";
import { useNavigate } from "react-router-dom";
import {
  IconCheck,
  IconUsers,
  IconBulb,
  IconRocket,
  IconTarget,
  IconHeart,
} from "@tabler/icons-react";

const About = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative w-full px-6 md:px-12 xl:px-15  md:pt-2 overflow-hidden">
        <div className="absolute top-10 left-0 w-[300px] md:w-[500px]  bg-purple-400/5 dark:bg-purple-900/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[250px] md:w-[600px]  bg-brandOrange/5 rounded-full blur-[150px] pointer-events-none"></div>

        <div className="relative z-10 max-w-[1400px] mx-auto">
          <div className="text-center mb-8 md:mb-12 py-20 md:py-10">
            <div className="inline-block px-4 py-2 rounded-full border border-brandOrange/30 bg-brandOrange/10 mb-6">
              <p className="text-brandOrange text-sm font-semibold tracking-wide">
                OUR STORY
              </p>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-gray-900 dark:text-white">
              Built for the{" "}
              <span className="text-brandOrange">next generation</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              FoundersFuel was born from a simple frustration — great startup
              ideas dying because of a talent gap, and talented freshers stuck
              because they couldn't find real experience. We fixed that.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="w-full px-6 md:px-12 xl:px-15 pb-16 md:py-2 relative">
        <div className="relative z-10 max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-16 md:mb-20">
            {/* Mission */}
            <div className="flex flex-col">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gray-100 dark:bg-[#100C1B] rounded-2xl flex items-center justify-center mb-6 border border-gray-200 dark:border-white/5">
                <IconTarget
                  stroke={1.5}
                  size={32}
                  className="text-brandOrange"
                />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Our Mission
              </h2>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                To bridge the gap between ambitious startups seeking fresh
                talent and brilliant freshers looking for meaningful experience.
                We connect passion with opportunity, transforming careers and
                businesses alike.
              </p>
            </div>

            {/* Vision */}
            <div className="flex flex-col">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gray-100 dark:bg-[#100C1B] rounded-2xl flex items-center justify-center mb-6 border border-gray-200 dark:border-white/5">
                <IconRocket
                  stroke={1.5}
                  size={32}
                  className="text-brandOrange"
                />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Our Vision
              </h2>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                To become the global hub where startup ecosystems thrive. A
                platform where ideas meet execution, where youth discovers
                potential, and where the next generation of unicorns and leaders
                are born.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="w-full px-6 md:px-12 xl:px-15 py-16 md:py-2 bg-white dark:bg-[#080410]/50 relative">
        <div className="relative z-10 max-w-[1400px] mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 md:mb-16 text-gray-900 dark:text-white">
            Our Core Values
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Value 1 */}
            <div className="p-6 md:p-8 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0f0b1a] hover:border-brandOrange/50 transition-all hover:-translate-y-1">
              <div className="w-10 h-10 bg-brandOrange/10 rounded-lg flex items-center justify-center mb-4">
                <IconUsers stroke={2} size={24} className="text-brandOrange" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Community First
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                We believe in the power of community. Success is built together,
                and we're committed to fostering meaningful connections.
              </p>
            </div>

            {/* Value 2 */}
            <div className="p-6 md:p-8 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0f0b1a] hover:border-brandOrange/50 transition-all hover:-translate-y-1">
              <div className="w-10 h-10 bg-brandOrange/10 rounded-lg flex items-center justify-center mb-4">
                <IconBulb stroke={2} size={24} className="text-brandOrange" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Innovation Driven
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                Continuous innovation is at our core. We adapt, improve, and
                evolve to meet the needs of the modern startup ecosystem.
              </p>
            </div>

            {/* Value 3 */}
            <div className="p-6 md:p-8 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0f0b1a] hover:border-brandOrange/50 transition-all hover:-translate-y-1">
              <div className="w-10 h-10 bg-brandOrange/10 rounded-lg flex items-center justify-center mb-4">
                <IconHeart stroke={2} size={24} className="text-brandOrange" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Passion & Impact
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                We're passionate about creating real impact. Every connection,
                every opportunity is a chance to change lives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="w-full px-6 md:px-12 xl:px-15 py-16 md:py-24">
        <div className="relative z-10 max-w-[1400px] mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 md:mb-16 text-gray-900 dark:text-white">
            Why Choose FoundersFuel?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
            {[
              {
                title: "Curated Opportunities",
                desc: "Handpicked startups and projects that match your skills and aspirations.",
              },
              {
                title: "Real Experience",
                desc: "Work on actual projects with real teams, not just theoretical tasks.",
              },
              {
                title: "Mentorship Program",
                desc: "Learn from experienced founders and industry leaders in your field.",
              },
              {
                title: "Global Network",
                desc: "Connect with talented individuals and innovative teams worldwide.",
              },
              {
                title: "Career Growth",
                desc: "Build your portfolio, gain experience, and launch your career with confidence.",
              },
              {
                title: "Flexible Engagement",
                desc: "Choose projects that fit your schedule and career goals perfectly.",
              },
            ].map((item, index) => (
              <div key={index} className="flex gap-4">
                <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-brandOrange/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <IconCheck
                    stroke={2.5}
                    size={20}
                    className="text-brandOrange"
                  />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full px-6 md:px-12 xl:px-15 py-16 md:py-2 bg-white dark:bg-[#080410]/30 relative">
        <div className="relative z-10 max-w-[1400px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 animate-pulse gap-6 md:gap-8">
            {[
              { number: "500+", label: "Startups" },
              { number: "10K+", label: "Freshers" },
              { number: "1000+", label: "Placements" },
              { number: "50+", label: "Countries" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-brandOrange mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-500 dark:text-gray-400 text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full px-6 md:px-12 xl:px-15 py-16 md:py-24">
        <div className="relative z-10 max-w-[1400px] mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
            Ready to Join the Ecosystem?
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-8 md:mb-10 text-base md:text-lg">
            Whether you're a fresher looking for your first opportunity or a
            startup searching for talent, FoundersFuel is your launchpad.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/register")}
              className="px-8 py-3 md:py-4 rounded-lg bg-brandOrange text-black font-semibold hover:bg-[#e65a25] transition-all transform hover:scale-105"
            >
              Get Started Now
            </button>
            {/* <button className="px-12 py-3 md:py-4 rounded-lg border border-brandOrange text-brandOrange font-semibold hover:bg-brandOrange/10 transition-all transform hover:scale-105 transition-colors">
              Learn More
            </button> */}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
