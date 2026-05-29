import React from "react";
import { IconShieldCheck, IconUser, IconClipboardCheck, IconMessageDots, IconScale, IconLock } from "@tabler/icons-react";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-background pt-24 pb-16 px-6 md:px-12 xl:px-15 transition-colors duration-300">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-900/5 dark:bg-purple-900/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-brandOrange/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-8xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 rounded-full border border-brandOrange/30 bg-brandOrange/10 mb-6">
            <p className="text-brandOrange text-sm font-semibold tracking-wide uppercase">
              LEGAL DOCUMENT
            </p>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
            Terms & <span className="text-brandOrange">Conditions</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed">
            Please read these terms carefully. They outline the rules and guidelines for using the FoundersFuel platform to ensure a safe and professional environment for all.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Section 1 */}
          <div className="p-8 rounded-2xl border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-[#0f0b1a]/50 backdrop-blur-md">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-brandOrange/10 rounded-xl">
                <IconClipboardCheck className="text-brandOrange" size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
                  By accessing and using this website, you agree to comply with and be bound by these Terms and Conditions. These rules ensure a safe and professional environment for both startups and freshers.
                </p>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                  If you do not agree with any part of these terms, please refrain from using the platform.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="p-8 rounded-2xl border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-[#0f0b1a]/50 backdrop-blur-md">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-brandBlue/10 rounded-xl">
                <IconUser className="text-brandBlue" size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. User Responsibilities</h2>
                <ul className="space-y-3 text-gray-500 dark:text-gray-400">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brandOrange"></span>
                    Provide accurate and truthful information in your profile and applications.
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brandOrange"></span>
                    Maintain professional behavior in all communications and collaborations.
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brandOrange"></span>
                    Avoid any misuse of the platform or engagement in illegal activities.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="p-8 rounded-2xl border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-[#0f0b1a]/50 backdrop-blur-md">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-brandGreen/10 rounded-xl">
                <IconScale className="text-brandGreen" size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Platform Role & Liability</h2>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
                  FoundersFuel acts as a connector between startups and freshers. All interactions, including project work and communication, are conducted directly between users.
                </p>
                <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 text-red-500 text-sm italic">
                  Important: The platform is not liable for any disputes, losses, or outcomes resulting from these direct interactions.
                </div>
              </div>
            </div>
          </div>

          {/* Section 4 */}
          <div className="p-8 rounded-2xl border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-[#0f0b1a]/50 backdrop-blur-md">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-500/10 rounded-xl">
                <IconShieldCheck className="text-purple-500" size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Integrity and Trust</h2>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                  We are committed to maintaining the integrity of our platform. We reserve the right to suspend or terminate accounts that violate our community guidelines or professional standards.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-16 text-center text-gray-500 dark:text-gray-400 text-sm">
          Last updated: April 21, 2026. For questions regarding these terms, please contact us through the contact page.
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
