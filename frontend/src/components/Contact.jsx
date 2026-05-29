import React, { useState } from "react";
import { IconMail, IconMapPin, IconAlarm, IconSend, IconLoader2 } from "@tabler/icons-react";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name || !form.email || !form.subject || !form.message)
      return setError("All fields are required.");

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send message");

      setSuccess(data.message || "Message sent! We'll get back to you within 24 hours.");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#100c22] px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none focus:border-brandOrange focus:ring-4 focus:ring-brandOrange/10 transition-colors";
  const labelClass = "text-sm text-gray-500 dark:text-[#9b93c1] uppercase tracking-[0.24em]";

  return (
    <div className="w-full">
      <section className="relative w-full px-6 md:px-12 xl:px-15 py-10 md:py-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,97,21,0.07),_transparent_45%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(255,97,21,0.14),_transparent_45%)] pointer-events-none" />
        <div className="relative z-10 max-w-[1400px] mx-auto">
          <div className="text-center mb-12 md:mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
              Get in <span className="text-brandOrange">touch</span>
            </h1>
            <p className="mt-4 text-gray-500 dark:text-gray-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              We'd love to hear from you. Send us a message and our team will respond as soon as possible.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_0.9fr] mb-16 gap-8">
            {/* Info Cards */}
            <div className="space-y-6 ">
              {[
                {
                  icon: <IconMail size={24} stroke={1.8} className="animate-bounce" />,
                  label: "Email",
                  value: "customercare@foundersfuel.com",
                  desc: "Reach out for support, partnership inquiries, or any general questions.",
                },
                {
                  icon: <IconMapPin size={24} stroke={1.8} className="animate-bounce" />,
                  label: "Location",
                  value: "Rajkot, India",
                  desc: "Our team is based in India and works remotely to support customers around the globe.",
                },
                {
                  icon: <IconAlarm size={24} stroke={1.8} className="animate-bounce" />,
                  label: "Response Time",
                  value: "Within 24 hours",
                  desc: "We strive to reply quickly to every message, so you can keep moving forward.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c0818] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.15)]"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-3xl bg-gray-100 dark:bg-[#11101f] grid place-items-center text-brandOrange shadow-[0_0_20px_rgba(255,97,21,0.15)]">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-gray-400 dark:text-[#8a82b9]">{item.label}</p>
                      <p className="text-[15px] font-semibold text-gray-900 dark:text-white">{item.value}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Contact Form */}
            <div className="rounded-[32px] border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0d0a1c]/80 p-8 shadow-[0_35px_80px_rgba(0,0,0,0.06)] dark:shadow-[0_35px_80px_rgba(0,0,0,0.18)]">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className={labelClass}>Name</label>
                    <input
                      type="text" name="name" value={form.name} onChange={handleChange}
                      placeholder="John Doe"
                      className={inputClass}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className={labelClass}>Email</label>
                    <input
                      type="email" name="email" value={form.email} onChange={handleChange}
                      placeholder="you@example.com"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className={labelClass}>Subject</label>
                  <input
                    type="text" name="subject" value={form.subject} onChange={handleChange}
                    placeholder="How can we help?"
                    className={inputClass}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className={labelClass}>Message</label>
                  <textarea
                    rows="3" name="message" value={form.message} onChange={handleChange}
                    placeholder="Tell us more..."
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-3 rounded-2xl bg-brandOrange px-6 py-4 text-black font-semibold hover:bg-[#e65a25] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? <IconLoader2 size={20} className="animate-spin" /> : <IconSend size={20} />}
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;