import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconHome,
  IconUsers,
  IconBuilding,
  IconBriefcase,
  IconLogout,
  IconMail,
  IconPhone,
  IconWorld,
  IconCode,
  IconChevronDown,
  IconChevronUp,
  IconShield,
  IconSun,
  IconMoon,
  IconMenu2,
  IconX,
  IconTrash,
  IconLoader2,
  IconMessage,
  IconLock,
  IconLockOpen,
} from "@tabler/icons-react";
import { useTheme } from "../../context/ThemeContext";
import ChatInterface from "../chat/ChatInterface";

const AdminDashboard = ({ user, onLogout }) => {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [freshers, setFreshers] = useState([]);
  const [startups, setStartups] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedStartup, setExpandedStartup] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [blacklistingUserId, setBlacklistingUserId] = useState(null);
  const [deletingApplicantId, setDeletingApplicantId] = useState(null);

  const handleInitiateChat = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${import.meta.env.VITE_API_URL || ""}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId })
      });
      setActiveTab("messages");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const [usersRes, jobsRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL || ""}/api/admin/users`, { headers }),
          fetch(`${import.meta.env.VITE_API_URL || ""}/api/admin/jobs`, { headers }),
        ]);

        if (usersRes.ok) {
          const userData = await usersRes.json();
          setFreshers((userData.users || []).filter((u) => u.userType === "fresher"));
          setStartups((userData.users || []).filter((u) => u.userType === "startup"));
        }
        if (jobsRes.ok) {
          const jobData = await jobsRes.json();
          setJobs(jobData.jobs || []);
        }
      } catch (err) {
        console.error("Admin fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalApplicants = jobs.reduce((sum, j) => sum + (j.applicants?.length || 0), 0);

  const getStartupJobs = (startupId) =>
    jobs.filter((j) => j.postedBy?._id === startupId || j.postedBy === startupId);

  /* ── Shared style tokens ── */
  const sidebarBg = "bg-white dark:bg-[#0d0a1c] border-r border-gray-200 dark:border-white/10";
  const mainBg = "bg-gray-50 dark:bg-background";
  const cardBg = "rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0d0a1c]";
  const innerCard = "bg-gray-50 dark:bg-[#100c22] border border-gray-100 dark:border-white/5";
  const textPrimary = "text-gray-900 dark:text-white";
  const textSecondary = "text-gray-500 dark:text-gray-400";
  const textMuted = "text-gray-400 dark:text-gray-500";

  const handleTabChange = (id) => {
    setActiveTab(id);
    setSidebarOpen(false); // close sidebar on mobile after tab select
  };

  const handleToggleBlacklist = async (userId, type) => {
    setBlacklistingUserId(userId);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/admin/users/${userId}/blacklist`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        const updateList = (list) =>
          list.map((u) => (u._id === userId ? { ...u, isBlacklisted: data.user.isBlacklisted } : u));
        
        if (type === "fresher") setFreshers(updateList(freshers));
        else setStartups(updateList(startups));
      } else {
        alert(data.message || "Failed to update blacklist status");
      }
    } catch (err) {
      alert("Network error. Please try again.");
    } finally {
      setBlacklistingUserId(null);
    }
  };

  const handleDeleteUser = async (userId, type) => {
    setDeletingUserId(userId);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        if (type === "fresher") {
          setFreshers(freshers.filter(f => f._id !== userId));
        } else {
          setStartups(startups.filter(s => s._id !== userId));
        }
        // Refetch jobs since applications/jobs might have changed
        const jobsRes = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/admin/jobs`, { headers: { Authorization: `Bearer ${token}` } });
        if (jobsRes.ok) {
          const jobData = await jobsRes.json();
          setJobs(jobData.jobs || []);
        }
      } else {
        const data = await res.json();
        alert(data.message || `Failed to delete ${type}`);
      }
    } catch (err) {
      alert("Network error. Please try again.");
    } finally {
      setDeletingUserId(null);
    }
  };

  const handleDeleteApplication = async (jobId, applicantId) => {
    setDeletingApplicantId(applicantId);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/jobs/${jobId}/application/${applicantId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        // Refetch jobs
        const jobsRes = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/admin/jobs`, { headers: { Authorization: `Bearer ${token}` } });
        if (jobsRes.ok) {
          const jobData = await jobsRes.json();
          setJobs(jobData.jobs || []);
        }
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete application");
      }
    } catch (err) {
      alert("Network error. Please try again.");
    } finally {
      setDeletingApplicantId(null);
    }
  };

  return (
    <div className={`min-h-screen ${mainBg} flex transition-colors duration-300`}>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          ${sidebarBg} flex flex-col fixed h-full z-40 transition-all duration-300
          w-64
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <div className="p-6 border-b border-gray-200 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-500/20 flex items-center justify-center">
              <IconShield size={20} className="text-red-500 dark:text-red-400" />
            </div>
            <div>
              <p className={`${textPrimary} font-semibold text-sm`}>Admin Panel</p>
              <p className="text-xs text-red-500 dark:text-red-400">Super Admin</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: "overview", label: "Dashboard Overview", icon: IconHome },
            { id: "freshers", label: "Fresher Network", icon: IconUsers },
            { id: "startups", label: "Startup Ecosystem", icon: IconBuilding },
            { id: "jobs", label: "Job Postings", icon: IconBriefcase },
            { id: "blacklist", label: "Restricted Access", icon: IconLock },
            // { id: "messages", label: "Admin Messenger", icon: IconMessage },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => handleTabChange(id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all text-sm font-bold ${
                activeTab === id
                  ? "bg-red-500/10 text-red-500 dark:text-red-400 border border-red-500/20 shadow-[0_4px_12px_rgba(239,68,68,0.1)]"
                  : `${textSecondary} hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5`
              }`}
            >
              <Icon size={18} stroke={2.5} />
              {label}
            </button>
          ))}
        </nav>

        <div className="p-4 space-y-2 border-t border-gray-200 dark:border-white/10">
          {/* Home Button */}
          <button
            onClick={() => navigate("/")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${textSecondary} hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all text-sm font-medium`}
          >
            <IconHome size={18} />
            Home
          </button>
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${textSecondary} hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all text-sm font-medium`}
          >
            {isDark ? <IconSun size={18} /> : <IconMoon size={18} />}
            {isDark ? "Light Mode" : "Dark Mode"}
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 dark:text-red-400 hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-300 transition-all text-sm font-medium"
          >
            <IconLogout size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 min-w-0">
        {/* Mobile Top Bar */}
        <div className={`lg:hidden sticky top-0 z-20 flex items-center justify-between px-4 py-3 ${sidebarBg} border-b border-gray-200 dark:border-white/10`}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-red-500/20 flex items-center justify-center">
              <IconShield size={15} className="text-red-500 dark:text-red-400" />
            </div>
            <span className={`${textPrimary} font-semibold text-sm`}>Admin Panel</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/10 ${textSecondary} hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all text-xs font-medium`}
            >
              <IconHome size={15} />
              Home
            </button>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`p-2 rounded-xl border border-gray-200 dark:border-white/10 ${textSecondary}`}
            >
              {sidebarOpen ? <IconX size={20} /> : <IconMenu2 size={20} />}
            </button>
          </div>
        </div>

        <div className={activeTab === "messages" ? "h-[calc(100vh-60px)] lg:h-screen overflow-hidden px-0 pb-0" : "p-4 sm:p-6 lg:p-8"}>
          {activeTab !== "messages" && (
            <div className="mb-6 lg:mb-8">
              <h1 className={`text-xl sm:text-2xl font-bold ${textPrimary} flex items-center gap-3`}>
                <IconShield size={24} className="text-red-500 dark:text-red-400" />
                Admin Dashboard
              </h1>
              <p className={`${textSecondary} text-sm mt-1`}>Complete overview of all platform data.</p>
            </div>
          )}

          {/* ── OVERVIEW TAB ── */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {[
                  { label: "Active Freshers", value: loading ? "..." : freshers.length, color: "text-brandOrange", icon: IconUsers },
                  { label: "Partner Startups", value: loading ? "..." : startups.length, color: "text-purple-500", icon: IconBuilding },
                  { label: "Open Positions", value: loading ? "..." : jobs.length, color: "text-blue-500", icon: IconBriefcase },
                  { label: "Total Applications", value: loading ? "..." : totalApplicants, color: "text-green-600", icon: IconMessage },
                ].map(({ label, value, color, icon: Icon }) => (
                  <div key={label} className={`${cardBg} p-5 sm:p-6 relative overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}>
                    <div className={`absolute top-0 right-0 p-4 opacity-[0.05] group-hover:opacity-10 transition-opacity ${color}`}>
                      <Icon size={80} stroke={1.5} />
                    </div>
                    <p className={`${textSecondary} text-xs sm:text-sm font-bold uppercase tracking-wider`}>{label}</p>
                    <p className={`text-3xl sm:text-4xl font-black mt-2 ${color}`}>{value}</p>
                  </div>
                ))}
              </div>

              {/* Recent Freshers */}
              <div className={`${cardBg} p-4 sm:p-6`}>
                <h2 className={`${textPrimary} font-semibold mb-4`}>Recent Freshers</h2>
                {loading ? (
                  <p className={`${textSecondary} text-sm`}>Loading...</p>
                ) : freshers.length === 0 ? (
                  <p className={`${textSecondary} text-sm`}>No freshers registered yet.</p>
                ) : (
                  <div className="space-y-2">
                    {freshers.slice(0, 5).map((f) => (
                      <div key={f._id} className={`flex items-center gap-3 p-3 rounded-xl ${innerCard}`}>
                        <div className="w-8 h-8 rounded-xl bg-brandOrange/20 flex items-center justify-center shrink-0">
                          <span className="text-brandOrange text-xs font-bold">{f.fullName?.charAt(0).toUpperCase()}</span>
                        </div>
                        <div className="min-w-0">
                          <p className={`${textPrimary} text-sm font-medium truncate`}>{f.fullName}</p>
                          <p className={`${textMuted} text-xs truncate`}>{f.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Startups */}
              <div className={`${cardBg} p-4 sm:p-6`}>
                <h2 className={`${textPrimary} font-semibold mb-4`}>Recent Startups</h2>
                {loading ? (
                  <p className={`${textSecondary} text-sm`}>Loading...</p>
                ) : startups.length === 0 ? (
                  <p className={`${textSecondary} text-sm`}>No startups registered yet.</p>
                ) : (
                  <div className="space-y-2">
                    {startups.slice(0, 5).map((s) => (
                      <div key={s._id} className={`flex items-center gap-3 p-3 rounded-xl ${innerCard}`}>
                        <div className="w-8 h-8 rounded-xl bg-purple-500/20 flex items-center justify-center shrink-0">
                          <span className="text-purple-500 dark:text-purple-400 text-xs font-bold">{s.companyName?.charAt(0).toUpperCase()}</span>
                        </div>
                        <div className="min-w-0">
                          <p className={`${textPrimary} text-sm font-medium truncate`}>{s.companyName}</p>
                          <p className={`${textMuted} text-xs truncate`}>{s.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── FRESHERS TAB ── */}
          {activeTab === "freshers" && (
            <div className="space-y-4">
              <h2 className={`${textPrimary} font-semibold text-lg`}>All Freshers ({freshers.length})</h2>
              {loading ? (
                <p className={textSecondary}>Loading...</p>
              ) : freshers.length === 0 ? (
                <div className="text-center py-16">
                  <IconUsers size={48} className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className={textSecondary}>No freshers registered yet.</p>
                </div>
              ) : (
                freshers.map((f) => (
                  <div key={f._id} className={`${cardBg} p-4 sm:p-5`}>
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-brandOrange/20 flex items-center justify-center shrink-0">
                        <span className="text-brandOrange font-bold text-sm sm:text-base">{f.fullName?.charAt(0).toUpperCase()}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className={`${textPrimary} font-semibold text-sm sm:text-base`}>{f.fullName}</p>
                            <p className={`${textSecondary} text-xs mt-0.5 flex items-center gap-1`}>
                              <IconMail size={11} /> <span className="truncate">{f.email}</span>
                            </p>
                            {f.phone && (
                              <p className={`${textSecondary} text-xs mt-0.5 flex items-center gap-1`}>
                                <IconPhone size={11} />  {f.phone}
                              </p>
                            )}
                          </div>
                          <span className="px-3 p-2 rounded-full bg-brandOrange/10 border border-brandOrange/20 text-brandOrange text-xs shrink-0">
                            Fresher
                          </span>
                          {f.isBlacklisted && (
                            <span className="px-3 p-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs shrink-0 font-bold uppercase tracking-wider">
                              Blacklisted
                            </span>
                          )}
                        </div>
                        {f.skills && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {f.skills.split(",").map((s) => (
                              <span key={s.trim()} className="px-2 py-0.5 rounded-full bg-brandOrange/10 border border-brandOrange/20 text-brandOrange text-xs flex items-center gap-1">
                                <IconCode size={10} />{s.trim()}
                              </span>
                            ))}
                          </div>
                          
                        )}
                      </div>
                      <div className="flex flex-col gap-2 shrink-0">
                        <button
                          onClick={() => handleToggleBlacklist(f._id, "fresher")}
                          disabled={blacklistingUserId === f._id || deletingUserId === f._id}
                          className={`p-1.5 sm:p-2 flex items-center gap-2 justify-center rounded-xl transition-colors disabled:opacity-50 border ${
                            f.isBlacklisted
                              ? "text-green-600 hover:bg-green-600/10 border-green-600/20"
                              : "text-amber-600 hover:bg-amber-600/10 border-amber-600/20"
                          }`}
                          title={f.isBlacklisted ? "Unblock User" : "Blacklist User"}
                        >
                          {blacklistingUserId === f._id ? (
                            <IconLoader2 size={20} className="animate-spin" />
                          ) : f.isBlacklisted ? (
                            <>
                              <IconLockOpen size={20} />
                              <span className="text-xs font-bold uppercase">Unblock</span>
                            </>
                          ) : (
                            <>
                              <IconLock size={20} />
                              <span className="text-xs font-bold uppercase">Blacklist</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`PERMANENT DELETION WARNING: Once you choose to completely remove this user (${f.fullName}), all their chat data, messages, and personal information will be completely removed from our system. This includes deleting the chat bar and all conversation history, and none of this data can be recovered. This action is final and irreversible. Proceed?`)) {
                              handleDeleteUser(f._id, "fresher");
                            }
                          }}
                        disabled={deletingUserId === f._id || blacklistingUserId === f._id}
                          className="p-1.5 sm:p-2 flex items-center gap-2 justify-center rounded-xl text-red-500 hover:bg-red-500/10 border border-red-500/20 transition-colors disabled:opacity-50"
                          title="Delete User"
                        >
                          {deletingUserId === f._id ? <IconLoader2 size={15} className="animate-spin" /> : <IconTrash size={20} />}Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ── STARTUPS TAB ── */}
          {activeTab === "startups" && (
            <div className="space-y-4">
              <h2 className={`${textPrimary} font-semibold text-lg`}>All Startups ({startups.length})</h2>
              {loading ? (
                <p className={textSecondary}>Loading...</p>
              ) : startups.length === 0 ? (
                <div className="text-center py-16">
                  <IconBuilding size={48} className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className={textSecondary}>No startups registered yet.</p>
                </div>
              ) : (
                startups.map((s) => {
                  const sJobs = getStartupJobs(s._id);
                  const sApplicants = sJobs.reduce((sum, j) => sum + (j.applicants?.length || 0), 0);
                  const isExpanded = expandedStartup === s._id;
                  return (
                    <div key={s._id} className={`${cardBg} overflow-hidden`}>
                      <div
                        onClick={() => setExpandedStartup(isExpanded ? null : s._id)}
                        className="w-full flex items-start gap-3 sm:gap-4 p-4 sm:p-5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-left cursor-pointer"
                      >
                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-purple-500/20 flex items-center justify-center shrink-0">
                          <span className="text-purple-500 dark:text-purple-400 font-bold text-sm sm:text-base">{s.companyName?.charAt(0).toUpperCase()}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`${textPrimary} font-semibold text-sm sm:text-base`}>{s.companyName}</p>
                          <p className={`${textSecondary} text-xs mt-0.5`}>{s.fullName}</p>
                          <p className={`${textMuted} text-xs mt-0.5 flex items-center gap-1`}>
                            <IconMail size={11} /> <span className="truncate">{s.email}</span>
                          </p>
                          {s.website && (
                            <p className={`${textMuted} text-xs mt-0.5 flex items-center gap-1`}>
                              <IconWorld size={11} /> <span className="truncate">{s.website}</span>
                            </p>
                          )}
                          <div className="flex gap-3 mt-2">
                            <span className="text-xs text-blue-500 dark:text-blue-400">{sJobs.length} job{sJobs.length !== 1 ? "s" : ""}</span>
                            <span className="text-xs text-purple-500 dark:text-purple-400">{sApplicants} applicant{sApplicants !== 1 ? "s" : ""}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end justify-between gap-2 shrink-0 h-full">
                          <div className="flex flex-col gap-2 shrink-0">
                            {/* <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleInitiateChat(s._id);
                              }}
                              className="p-1.5 sm:p-2 flex items-center gap-2 justify-center rounded-xl text-brandOrange hover:bg-brandOrange/10 border border-brandOrange/20 transition-colors"
                              title="Message User"
                            >
                              <IconMessage size={20} />Message
                            </button> */}
                             <button
                               onClick={(e) => {
                                 e.stopPropagation();
                                 handleToggleBlacklist(s._id, "startup");
                               }}
                               disabled={blacklistingUserId === s._id || deletingUserId === s._id}
                               className={`p-1.5 sm:p-2 flex items-center gap-2 justify-center rounded-xl transition-colors disabled:opacity-50 border ${
                                 s.isBlacklisted
                                   ? "text-green-600 hover:bg-green-600/10 border-green-600/20"
                                   : "text-amber-600 hover:bg-amber-600/10 border-amber-600/20"
                               }`}
                               title={s.isBlacklisted ? "Unblock User" : "Blacklist User"}
                             >
                               {blacklistingUserId === s._id ? (
                                 <IconLoader2 size={20} className="animate-spin" />
                               ) : s.isBlacklisted ? (
                                 <>
                                   <IconLockOpen size={20} />
                                   <span className="text-xs font-bold uppercase">Unblock</span>
                                 </>
                               ) : (
                                 <>
                                   <IconLock size={20} />
                                   <span className="text-xs font-bold uppercase">Blacklist</span>
                                 </>
                               )}
                             </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm(`PERMANENT DELETION WARNING: Once you choose to completely remove this startup (${s.companyName}), all their chat data, messages, and personal information will be completely removed from our system. This includes deleting the chat bar and all conversation history, and none of this data can be recovered. This action is final and irreversible. Proceed?`)) {
                                 handleDeleteUser(s._id, "startup");
                               }
                            }}
                            disabled={deletingUserId === s._id || blacklistingUserId === s._id}
                              className="p-1.5 sm:p-2 flex items-center gap-2 justify-center rounded-xl text-red-500 hover:bg-red-500/10 border border-red-500/20 transition-colors disabled:opacity-50"
                              title="Delete User"
                            >
                              {deletingUserId === s._id ? <IconLoader2 size={15} className="animate-spin" /> : <IconTrash size={20} />}Delete
                            </button>
                          </div>
                           <div className="flex items-center gap-2 mt-auto">
                            <span className="px-2 sm:px-5 py-2.5 mt-3 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-500 dark:text-purple-400 text-xs">Startup</span>
                            {s.isBlacklisted && (
                              <span className="px-3 p-2 mt-3 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold uppercase tracking-wider">
                                Blacklisted
                              </span>
                            )}
                            {isExpanded
                              ? <IconChevronUp size={16} className={textMuted} />
                              : <IconChevronDown size={16} className={textMuted} />}
                          </div>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="border-t border-gray-100 dark:border-white/5 p-4 sm:p-5">
                          <p className={`text-xs ${textMuted} uppercase tracking-widest mb-3`}>Jobs Posted by {s.companyName}</p>
                          {sJobs.length === 0 ? (
                            <p className={`${textMuted} text-sm`}>No jobs posted yet.</p>
                          ) : (
                            <div className="space-y-3">
                              {sJobs.map((job) => (
                                <div key={job._id} className={`rounded-xl ${innerCard} p-3 sm:p-4`}>
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                      <p className={`${textPrimary} font-medium text-sm`}>{job.title}</p>
                                      <p className={`${textMuted} text-xs mt-0.5`}>{job.type} · {job.duration || "—"} · {job.stipend || "—"}</p>
                                      {job.tags?.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-2">
                                          {job.tags.map((t) => (
                                            <span key={t} className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 text-xs">{t}</span>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                    <span className="text-purple-500 dark:text-purple-400 text-xs shrink-0">{job.applicants?.length || 0} applied</span>
                                  </div>

                                  {/* Applicants inline */}
                                  {job.applicants?.length > 0 && (
                                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-white/5">
                                      <p className={`text-xs ${textMuted} mb-2`}>Applicants:</p>
                                      <div className="space-y-2">
                                        {job.applicants.map((ap, idx) => (
                                          <div key={ap._id || idx} className="flex items-center gap-2 flex-wrap">
                                            <div className="w-6 h-6 rounded-lg bg-brandOrange/20 flex items-center justify-center shrink-0">
                                              <span className="text-brandOrange text-xs font-bold">{ap.fullName?.charAt(0).toUpperCase() || "?"}</span>
                                            </div>
                                            <div className="flex flex-wrap gap-x-2 gap-y-0.5">
                                              <span className={`${textPrimary} text-xs font-medium`}>{ap.fullName || "Fresher"}</span>
                                              {ap.email && <span className={`${textMuted} text-xs`}>{ap.email}</span>}
                                              {ap.skills && <span className={`${textMuted} text-xs`}>· {ap.skills}</span>}
                                              <button
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  if (window.confirm(`Delete application by ${ap.fullName || "this applicant"}?`)) {
                                                    handleDeleteApplication(job._id, ap._id);
                                                  }
                                                }}
                                                disabled={deletingApplicantId === ap._id}
                                                className="ml-auto p-1 rounded-md text-red-500 hover:bg-red-500/10 transition-colors"
                                                title="Delete Application"
                                              >
                                                {deletingApplicantId === ap._id ? <IconLoader2 size={14} className="animate-spin" /> : <IconTrash size={14} />}
                                              </button>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* ── JOBS TAB ── */}
          {activeTab === "jobs" && (
            <div className="space-y-4">
              <h2 className={`${textPrimary} font-semibold text-lg`}>All Jobs ({jobs.length})</h2>
              {loading ? (
                <p className={textSecondary}>Loading...</p>
              ) : jobs.length === 0 ? (
                <div className="text-center py-16">
                  <IconBriefcase size={48} className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className={textSecondary}>No jobs posted yet.</p>
                </div>
              ) : (
                jobs.map((job) => (
                  <div key={job._id} className={`${cardBg} p-4 sm:p-5`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className={`${textPrimary} font-semibold text-sm sm:text-base`}>{job.title}</h3>
                        <p className={`${textSecondary} text-sm mt-1 flex items-center gap-1 flex-wrap`}>
                          <IconBuilding size={13} />
                          {job.postedBy?.companyName || job.company || "Startup"}
                          {job.postedBy?.email && (
                            <span className={`${textMuted} truncate`}>· {job.postedBy.email}</span>
                          )}
                        </p>
                        <div className={`flex flex-wrap gap-2 sm:gap-3 mt-2 text-xs ${textMuted}`}>
                          <span className="capitalize">{job.type}</span>
                          {job.duration && <span>{job.duration}</span>}
                          {job.stipend && <span className="text-brandOrange">{job.stipend}</span>}
                        </div>
                        {job.tags?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {job.tags.map((t) => (
                              <span key={t} className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 text-xs">{t}</span>
                            ))}
                          </div>
                        )}

                        {/* Applicants */}
                        {job.applicants?.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-white/5">
                            <p className="text-xs text-purple-500 dark:text-purple-400 font-medium mb-2">
                              {job.applicants.length} Applicant{job.applicants.length !== 1 ? "s" : ""}:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {job.applicants.map((ap, idx) => (
                                <div key={ap._id || idx} className={`flex items-center gap-1.5 px-2 py-1 rounded-lg ${innerCard}`}>
                                  <div className="w-5 h-5 rounded-md bg-brandOrange/20 flex items-center justify-center shrink-0">
                                    <span className="text-brandOrange text-xs font-bold">{ap.fullName?.charAt(0).toUpperCase() || "?"}</span>
                                  </div>
                                  <span className={`${textPrimary} text-xs`}>{ap.fullName || "Fresher"}</span>
                                  {ap.email && <span className={`${textMuted} text-xs hidden sm:inline`}>· {ap.email}</span>}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (window.confirm("Delete this application?")) {
                                        handleDeleteApplication(job._id, ap._id);
                                      }
                                    }}
                                    disabled={deletingApplicantId === ap._id}
                                    className="ml-1 p-1 rounded-md text-red-500 hover:bg-red-500/10 transition-colors"
                                    title="Delete Application"
                                  >
                                    {deletingApplicantId === ap._id ? <IconLoader2 size={13} className="animate-spin" /> : <IconTrash size={13} />}
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <span className={`shrink-0 px-2 sm:px-3 py-1 rounded-full text-xs ${
                        job.status === "open"
                          ? "bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400"
                          : "bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400"
                      }`}>
                        {job.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ── RESTRICTED ACCESS (BLACKLIST) TAB ── */}
          {activeTab === "blacklist" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className={`${textPrimary} font-semibold text-xl flex items-center gap-2`}>
                  <IconLock size={24} className="text-amber-500" />
                  Restricted Access ({freshers.filter(f => f.isBlacklisted).length + startups.filter(s => s.isBlacklisted).length})
                </h2>
                <p className={`${textSecondary} text-sm`}>
                  Manage accounts that have been blocked from platform access.
                </p>
              </div>

              {/* Combined Blacklisted List */}
              <div className="space-y-4">
                {[
                  ...freshers.filter(f => f.isBlacklisted).map(u => ({ ...u, uType: 'fresher' })),
                  ...startups.filter(s => s.isBlacklisted).map(u => ({ ...u, uType: 'startup' }))
                ].length === 0 ? (
                  <div className={`${cardBg} p-12 text-center`}>
                    <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4 border border-green-500/20">
                      <IconLockOpen className="text-green-500" size={32} />
                    </div>
                    <h3 className={`${textPrimary} font-bold text-lg`}>No restricted users</h3>
                    <p className={textSecondary}>All registered users currently have platform access.</p>
                  </div>
                ) : (
                  [
                    ...freshers.filter(f => f.isBlacklisted).map(u => ({ ...u, uType: 'fresher' })),
                    ...startups.filter(s => s.isBlacklisted).map(u => ({ ...u, uType: 'startup' }))
                  ].map((user) => (
                    <div key={user._id} className={`${cardBg} p-4 sm:p-5 border-l-4 border-amber-500`}>
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${user.uType === 'startup' ? 'bg-purple-500/20 text-purple-500' : 'bg-brandOrange/20 text-brandOrange'}`}>
                          <span className="font-bold text-lg">{(user.companyName || user.fullName)?.charAt(0).toUpperCase()}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h3 className={`${textPrimary} font-bold`}>{user.companyName || user.fullName}</h3>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${user.uType === 'startup' ? 'bg-purple-500/10 text-purple-500' : 'bg-brandOrange/10 text-brandOrange'}`}>
                              {user.uType}
                            </span>
                          </div>
                          <p className={`${textSecondary} text-xs flex items-center gap-1`}>
                            <IconMail size={12} /> {user.email}
                          </p>
                        </div>
                        <button
                          onClick={() => handleToggleBlacklist(user._id, user.uType)}
                          disabled={blacklistingUserId === user._id}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 transition-all text-sm font-bold shadow-lg shadow-green-600/20 disabled:opacity-50"
                        >
                          {blacklistingUserId === user._id ? (
                            <IconLoader2 size={18} className="animate-spin" />
                          ) : (
                            <>
                              <IconLockOpen size={18} />
                              Unblock Access
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ── CHAT MANAGEMENT TAB ── */}
          {/* {activeTab === "messages" && (
            <div className="h-full">
              <ChatInterface user={user} />
            </div>
          )} */}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;