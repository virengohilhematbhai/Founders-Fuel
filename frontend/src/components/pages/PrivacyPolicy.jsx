import React from "react";
import { IconLock, IconEye, IconUserShield, IconFileText,
  IconShieldCheck,
   IconDatabase, IconCloudLock } from "@tabler/icons-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-background pt-24 pb-16 px-6 md:px-12 xl:px-15 transition-colors duration-300">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-900/5 dark:bg-purple-900/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-brandOrange/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-8xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 rounded-full border border-brandBlue/30 bg-brandBlue/10 mb-6">
            <p className="text-brandBlue text-sm font-semibold tracking-wide uppercase">
              PRIVACY POLICY
            </p>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
            Our Data <span className="text-brandBlue">Commitment</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed">
            We value your trust and are committed to protecting your personal information. This policy explains how we collect, use, and safeguard your data.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Section 1 */}
          <div className="p-8 rounded-2xl border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-[#0f0b1a]/50 backdrop-blur-md">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-brandBlue/10 rounded-xl">
                <IconDatabase className="text-brandBlue" size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Information Collection</h2>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
                  We collect personal information such as your name, email, and contact details only to improve user experience and provide better services.
                </p>
                <div className="p-4 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm">
                  <p className="text-gray-900 dark:text-white font-medium mb-2">What we collect:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-500 dark:text-gray-400">
                    <li>Contact Details (Email, Phone)</li>
                    <li>Profile Metadata (Skills, Bio)</li>
                    <li>Usage Statistics (Analytics)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="p-8 rounded-2xl border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-[#0f0b1a]/50 backdrop-blur-md">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-brandGreen/10 rounded-xl">
                <IconEye className="text-brandGreen" size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Use of Information</h2>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
                  Your data is used to facilitate connections between startups and freshers, personalize your dashboard, and ensure security.
                </p>
                <div className="flex items-center gap-2 p-3 bg-brandGreen/5 border border-brandGreen/10 rounded-lg text-brandGreen text-sm">
                  <IconShieldCheck size={18} />
                  <span>We do not sell your personal data to third parties.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="p-8 rounded-2xl border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-[#0f0b1a]/50 backdrop-blur-md">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-brandOrange/10 rounded-xl">
                <IconCloudLock className="text-brandOrange" size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Data Security</h2>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                  We implement industry-standard security measures to safeguard your information from unauthorized access, alteration, or disclosure. However, no method of transmission over the internet is 100% secure.
                </p>
              </div>
            </div>
          </div>

          {/* Section 4 */}
          <div className="p-8 rounded-2xl border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-[#0f0b1a]/50 backdrop-blur-md">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-brandPurple-light/10 rounded-xl">
                <IconUserShield className="text-purple-500" size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Disclosure to Third Parties</h2>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                  We do not share or sell personal data with third parties without your explicit consent, except when required by law or to protect the rights and safety of our community.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-16 text-center text-gray-500 dark:text-gray-400 text-sm">
          Last updated: April 21, 2026. Your continued use of the platform constitutes acceptance of this policy.
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
