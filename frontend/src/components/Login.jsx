import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconLock,
  IconAt,
  IconArrowRight,
  IconShieldCheck,
  IconLoader2,
} from "@tabler/icons-react";

const Login = ({ onLogin }) => {
  const [form, setForm] = useState({ email: "", password: "", rememberMe: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.email || !form.password)
      return setError("Please enter your email and password.");

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Pinggy-No-Screen": "true",
          "bypass-tunnel-reminder": "true",
        },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      let data;
      try {
        data = await res.json();
      } catch (e) {
        throw new Error("Unable to connect to the backend API. Please make sure the backend server is running.");
      }

      if (!res.ok) throw new Error(data?.message || "Login failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setSuccess(`Welcome back, ${data.user.fullName}! Redirecting to dashboard...`);

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
    "w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#100c22] px-12 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none focus:border-brandOrange focus:ring-4 focus:ring-brandOrange/10 transition-colors";
  const labelClass = "text-sm text-gray-500 dark:text-[#9b93c1] uppercase tracking-[0.24em]";

  return (
    <div className="w-full">
      <section className="relative w-full px-6 md:px-12 xl:px-15 py-10 md:py-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,97,21,0.06),_transparent_35%)] dark:bg-[radial-gradient(circle_at_top_right,_rgba(255,97,21,0.12),_transparent_35%)] pointer-events-none" />
        <div className="relative z-10 max-w-[1400px] mx-auto">
          <div className="text-center mb-12 md:mb-10">
            <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold text-gray-900 dark:text-white">
              Login to your <span className="text-brandOrange">FoundersFuel</span> account
            </h1>
            <p className="mt-4 text-gray-500 dark:text-gray-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Access your projects, track startup applications, and continue building your future.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-8">
            {/* Info Panel */}
            <div className="rounded-[32px] border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0d0a1c]/80 p-8 shadow-[0_35px_80px_rgba(0,0,0,0.06)] dark:shadow-[0_35px_80px_rgba(0,0,0,0.18)]">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Secure access</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                Use your registered email and password to sign in safely. Our platform uses modern
                security practices to protect your account.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="rounded-3xl bg-gray-50 dark:bg-[#100c22] p-6 border border-gray-200 dark:border-white/10">
                  <div className="w-12 h-12 rounded-2xl bg-brandOrange/10 flex items-center justify-center mb-4">
                    <IconAt size={24} className="text-brandOrange" />
                  </div>
                  <p className="text-sm uppercase tracking-[0.24em] text-gray-400 dark:text-[#9b93c1] mb-2">Need help?</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Contact support at customercare@foundersfuel.com</p>
                </div>
                <div className="rounded-3xl bg-gray-50 dark:bg-[#100c22] p-6 border border-gray-200 dark:border-white/10">
                  <div className="w-12 h-12 rounded-2xl bg-brandOrange/10 flex items-center justify-center mb-4">
                    <IconShieldCheck size={24} className="text-brandOrange" />
                  </div>
                  <p className="text-sm uppercase tracking-[0.24em] text-gray-400 dark:text-[#9b93c1] mb-2">Safe login</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Encrypted login flow and secure session management.</p>
                </div>
              </div>

              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
                Don't have an account?{" "}
                <button
                  onClick={() => navigate("/register")}
                  className="text-brandOrange hover:text-orange-400 font-semibold"
                >
                  Create one
                </button>
              </p>
            </div>

            {/* Login Form */}
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

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-2">
                  <label className={labelClass}>Email</label>
                  <div className="relative">
                    <IconAt className="absolute left-4 top-1/2 -translate-y-1/2 text-brandOrange" size={20} />
                    <input
                      type="email" name="email" value={form.email} onChange={handleChange}
                      placeholder="you@example.com"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className={labelClass}>Password</label>
                  <div className="relative">
                    <IconLock className="absolute left-4 top-1/2 -translate-y-1/2 text-brandOrange" size={20} />
                    <input
                      type="password" name="password" value={form.password} onChange={handleChange}
                      placeholder="Enter your password"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <label className="flex items-center gap-3 text-sm text-gray-500 dark:text-[#9b93c1]">
                    <input
                      type="checkbox" name="rememberMe" checked={form.rememberMe} onChange={handleChange}
                      className="h-4 w-4 rounded border-gray-300 dark:border-white/10 bg-gray-100 dark:bg-[#100c22] text-brandOrange focus:ring-brandOrange"
                    />
                    Remember me
                  </label>
                  <button type="button" className="text-sm text-brandOrange hover:text-orange-400 transition-colors">
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-3 rounded-2xl bg-brandOrange px-6 py-4 text-black font-semibold hover:bg-[#e65a25] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? <IconLoader2 size={20} className="animate-spin" /> : <IconArrowRight size={20} />}
                  {loading ? "Logging in..." : "Login Now"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;