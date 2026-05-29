import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconUserPlus,
  IconMail,
  IconLock,
  IconPhone,
  IconRocket,
  IconArrowRight,
  IconShieldHalf,
  IconSchoolFilled,
  IconBuildingSkyscraper,
  IconWorld,
  IconLoader2,
} from "@tabler/icons-react";

const Registration = ({ onLogin }) => {
  const [userType, setUserType] = useState("fresher");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    skills: "",
    companyName: "",
    website: "",
    agreeTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.fullName || !form.email || !form.password)
      return setError("Full name, email and password are required.");
    if (form.password.length < 6)
      return setError("Password must be at least 6 characters.");
    if (!form.agreeTerms)
      return setError("Please agree to the Terms of Service.");
    if (userType === "fresher" && !form.phone)
      return setError("Phone number is required for freshers.");
    if (userType === "startup" && !form.companyName)
      return setError("Company name is required for startups.");

    setLoading(true);
    try {
      const payload = {
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        userType,
        ...(userType === "fresher"
          ? { phone: form.phone, skills: form.skills }
          : { companyName: form.companyName, website: form.website }),
      };

      const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setSuccess("Account created successfully! Redirecting to your dashboard...");

      setTimeout(() => {
        onLogin(data.user);
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#100c22] px-12 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none focus:border-brandOrange focus:ring-4 focus:ring-brandOrange/10 transition-colors text-[15px]";
  const labelClass = "text-sm text-gray-500 dark:text-[#9b93c1] uppercase tracking-[0.24em]";

  return (
    <div className="w-full">
      <section className="relative w-full px-6 md:px-12 xl:px-15 py-10 md:py-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,97,21,0.06),_transparent_35%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(255,97,21,0.12),_transparent_35%)] pointer-events-none" />
        <div className="relative z-10 max-w-[1400px] mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <p className="text-sm uppercase tracking-[0.3em] text-brandOrange mb-4">Join Us Today</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white">
              Create your <span className="text-brandOrange">FoundersFuel</span> account
            </h1>
            <p className="mt-4 text-gray-500 dark:text-gray-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Sign up to connect with startups, find opportunities, or list your startup for talented freshers.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            {/* Tab Navigation */}
            <div className="flex gap-4 mb-8 rounded-3xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#0d0a1c]/50 p-2">
              <button
                type="button"
                onClick={() => { setUserType("fresher"); setError(""); }}
                className={`flex-1 py-3 px-6 rounded-2xl font-semibold transition-all text-center ${
                  userType === "fresher"
                    ? "bg-brandOrange text-black shadow-lg"
                    : "text-black dark:text-gray-400 hover:text-gray-500 dark:hover:text-white"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <IconSchoolFilled className="w-6 h-6" strokeWidth={1.5} /> Fresher
                </div>
              </button>
              <button
                type="button"
                onClick={() => { setUserType("startup"); setError(""); }}
                className={`flex-1 py-3 px-6 rounded-2xl font-semibold transition-all text-center ${
                  userType === "startup"
                    ? "bg-brandOrange text-black shadow-lg"
                    : "text-black dark:text-gray-400 hover:text-gray-500 dark:hover:text-white"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <IconRocket stroke={2} /> Startup
                </div>
              </button>
            </div>

            {/* Form Card */}
            <div className="rounded-[32px] border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c0818] p-8 shadow-[0_35px_80px_rgba(0,0,0,0.06)] dark:shadow-[0_35px_80px_rgba(0,0,0,0.18)]">
              {error && (
                <div className="mb-5 rounded-2xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-red-500 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-5 rounded-2xl bg-green-500/10 border border-green-500/30 px-4 py-3 text-green-600 dark:text-green-400 text-sm">
                  {success}
                </div>
              )}

              <form className="space-y-5" onSubmit={handleSubmit}>
                {/* Full Name */}
                <div className="flex flex-col gap-2">
                  <label className={labelClass}>Full Name</label>
                  <div className="relative">
                    <IconUserPlus className="absolute left-4 top-1/2 -translate-y-1/2 text-brandOrange" size={20} />
                    <input
                      type="text" name="fullName" value={form.fullName} onChange={handleChange}
                      placeholder="John Doe"
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Phone / Company Name */}
                {userType === "startup" ? (
                  <div className="flex flex-col gap-2">
                    <label className={labelClass}>Company Name</label>
                    <div className="relative">
                      <IconBuildingSkyscraper className="absolute left-4 top-1/2 -translate-y-1/2 text-brandOrange" size={20} />
                      <input
                        type="text" name="companyName" value={form.companyName} onChange={handleChange}
                        placeholder="Your Startup Inc."
                        className={inputClass}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <label className={labelClass}>Phone Number</label>
                    <div className="relative">
                      <IconPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-brandOrange" size={20} />
                      <input
                        type="tel" name="phone" value={form.phone} onChange={handleChange}
                        placeholder="+91 XXXXX XXXXX"
                        className={inputClass}
                      />
                    </div>
                  </div>
                )}

                {/* Email */}
                <div className="flex flex-col gap-2">
                  <label className={labelClass}>Email Address</label>
                  <div className="relative">
                    <IconMail className="absolute left-4 top-1/2 -translate-y-1/2 text-brandOrange" size={20} />
                    <input
                      type="email" name="email" value={form.email} onChange={handleChange}
                      placeholder="you@example.com"
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Website / Skills */}
                {userType === "startup" ? (
                  <div className="flex flex-col gap-2">
                    <label className={labelClass}>Website</label>
                    <div className="relative">
                      <IconWorld className="absolute left-4 top-1/2 -translate-y-1/2 text-brandOrange" size={20} />
                      <input
                        type="url" name="website" value={form.website} onChange={handleChange}
                        placeholder="https://yourcompany.com"
                        className={inputClass}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <label className={labelClass}>Skills</label>
                    <div className="relative">
                      <IconShieldHalf stroke={2} className="absolute left-4 top-1/2 -translate-y-1/2 text-brandOrange" size={20} />
                      <input
                        type="text" name="skills" value={form.skills} onChange={handleChange}
                        placeholder="React, Node.js, UI/UX, Python"
                        className={inputClass}
                      />
                    </div>
                  </div>
                )}

                {/* Password */}
                <div className="flex flex-col gap-2">
                  <label className={labelClass}>Password</label>
                  <div className="relative">
                    <IconLock className="absolute left-4 top-1/2 -translate-y-1/2 text-brandOrange" size={20} />
                    <input
                      type="password" name="password" value={form.password} onChange={handleChange}
                      placeholder="Min 6 characters"
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Terms */}
                <label className="flex items-start gap-3 text-sm text-gray-500 dark:text-[#9b93c1]">
                  <input
                    type="checkbox" name="agreeTerms" checked={form.agreeTerms} onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 dark:border-white/10 bg-gray-100 dark:bg-[#100c22] text-brandOrange focus:ring-brandOrange mt-1"
                  />
                  <span>
                    I agree to the{" "}
                    <a href="#" className="text-brandOrange hover:underline">Terms of Service</a>{" "}
                    and{" "}
                    <a href="#" className="text-brandOrange hover:underline">Privacy Policy</a>
                  </span>
                </label>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-3 rounded-2xl bg-brandOrange px-6 py-3 text-black font-semibold hover:bg-[#e65a25] transition-colors mt-6 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? <IconLoader2 size={20} className="animate-spin" /> : <IconArrowRight size={20} />}
                  {loading ? "Creating Account..." : userType === "startup" ? "Join as Startup" : "Create Account"}
                </button>
              </form>

              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="text-brandOrange hover:text-orange-400 font-semibold"
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Registration;