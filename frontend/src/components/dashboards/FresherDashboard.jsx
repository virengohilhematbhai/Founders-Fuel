import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconBriefcase,
  IconUser,
  IconLogout,
  IconHome,
  IconUpload,
  IconBell,
  IconChevronRight,
  IconSearch,
  IconClock,
  IconStar,
  IconCheck,
  IconLoader2,
  IconBuilding,
  IconWorld,
  IconMail,
  IconSun,
  IconMoon,
  IconMenu2,
  IconX,
  IconTrash,
  IconMessage,
} from "@tabler/icons-react";
import { useTheme } from "../../context/ThemeContext";
import ChatInterface from "../chat/ChatInterface";
import { Country, State, City } from "country-state-city";
import { IconSortAscending, IconSortDescending, IconFilter, IconChevronDown } from "@tabler/icons-react";
import DashboardFeedbackTab from "../profile/DashboardFeedbackTab";

const FresherDashboard = ({ user, onLogout, setCurrentPage }) => {
  const navigate = useNavigate();
  const isFresher = user?.userType === "fresher";
  const { isDark, toggleTheme } = useTheme();

  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [applyingJobId, setApplyingJobId] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState(() => {
    if (!isFresher) return [];
    const stored = localStorage.getItem(`appliedJobs_${user?.id || user?._id}`);
    return stored ? JSON.parse(stored) : [];
  });
  const [applyMessage, setApplyMessage] = useState({
    jobId: null,
    text: "",
    type: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deletingJobId, setDeletingJobId] = useState(null);

  // Advanced Filtering State
  const [filterState, setFilterState] = useState({
    country: "",
    state: "",
    city: "",
    salaryRanges: [], // e.g. ["0-10", "10-20"]
    type: "", // remote, onsite, hybrid
    sortOrder: "desc" // stipend desc
  });
  const [appliedFilters, setAppliedFilters] = useState({
    country: "",
    state: "",
    city: "",
    salaryRanges: [],
    type: "",
    sortOrder: "desc",
    query: ""
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showSalaryDropdown, setShowSalaryDropdown] = useState(false);

  const handleApplyFilters = () => {
    setAppliedFilters({
      ...filterState,
      query: searchQuery
    });
  };

  const handleQuickFilter = (type, value) => {
    if (type === "workMode") {
      const newType = filterState.type === value ? "" : value;
      const newFilter = { ...filterState, type: newType };
      setFilterState(newFilter);
      setAppliedFilters({ ...newFilter, query: searchQuery });
    } else {
      setSearchQuery(value);
      const newFilter = { ...filterState };
      setFilterState(newFilter);
      setAppliedFilters({ ...newFilter, query: value });
    }
  };

  const handleInitiateChat = async (userId, jobId) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${import.meta.env.VITE_API_URL || ""}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, jobId }),
      });
      setActiveTab("messages");
    } catch (err) {
      console.error(err);
    }
  };

  // Project submission state
  const [projectForm, setProjectForm] = useState({
    name: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    projectTitle: "",
    description: "",
  });
  const [projectFiles, setProjectFiles] = useState([]);
  const [projectSubmitting, setProjectSubmitting] = useState(false);
  const [projectMessage, setProjectMessage] = useState({ text: "", type: "" });

  const handleProjectFileChange = (e) => {
    setProjectFiles([...e.target.files]);
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    setProjectSubmitting(true);
    setProjectMessage({ text: "", type: "" });
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("name", projectForm.name);
      formData.append("email", projectForm.email);
      formData.append("phone", projectForm.phone);
      formData.append("projectTitle", projectForm.projectTitle);
      formData.append("description", projectForm.description);

      projectFiles.forEach((file) => {
        formData.append("files", file);
      });

      const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/projects`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setProjectMessage({
          text: "Project submitted successfully!",
          type: "success",
        });
        setProjectForm((prev) => ({
          ...prev,
          projectTitle: "",
          description: "",
        }));
        setProjectFiles([]);
        document.getElementById("projectFileInput").value = "";
      } else {
        setProjectMessage({
          text: data.message || "Failed to submit project.",
          type: "error",
        });
      }
    } catch (err) {
      setProjectMessage({
        text: "Network error. Please try again.",
        type: "error",
      });
    } finally {
      setProjectSubmitting(false);
      setTimeout(() => setProjectMessage({ text: "", type: "" }), 4000);
    }
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/jobs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setJobs(data.jobs || data || []);
        }
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
      } finally {
        setLoadingJobs(false);
      }
    };
    fetchJobs();
  }, []);

  const skills = user.skills ? user.skills.split(",").map((s) => s.trim()) : [];

  const handleApply = async (jobId) => {
    if (!isFresher || appliedJobs.includes(jobId)) return;
    setApplyingJobId(jobId);
    setApplyMessage({ jobId, text: "", type: "" });
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/jobs/${jobId}/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        const newApplied = [...appliedJobs, jobId];
        setAppliedJobs(newApplied);
        localStorage.setItem(
          `appliedJobs_${user?.id || user?._id}`,
          JSON.stringify(newApplied),
        );
        setApplyMessage({
          jobId,
          text: "Application submitted successfully!",
          type: "success",
        });
      } else {
        setApplyMessage({
          jobId,
          text: data.message || "Failed to apply.",
          type: "error",
        });
      }
    } catch (err) {
      setApplyMessage({
        jobId,
        text: "Network error. Please try again.",
        type: "error",
      });
    } finally {
      setApplyingJobId(null);
      setTimeout(
        () => setApplyMessage({ jobId: null, text: "", type: "" }),
        3000,
      );
    }
  };

  const handleDeleteApplication = async (jobId) => {
    if (!isFresher || !appliedJobs.includes(jobId)) return;
    setDeletingJobId(jobId);
    setApplyMessage({ jobId, text: "", type: "" });
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/jobs/${jobId}/application/${user._id || user.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await res.json();
      if (res.ok) {
        const newApplied = appliedJobs.filter((id) => id !== jobId);
        setAppliedJobs(newApplied);
        localStorage.setItem(
          `appliedJobs_${user?.id || user?._id}`,
          JSON.stringify(newApplied),
        );
        setApplyMessage({
          jobId,
          text: "Application deleted successfully!",
          type: "success",
        });
      } else {
        setApplyMessage({
          jobId,
          text: data.message || "Failed to delete application.",
          type: "error",
        });
      }
    } catch (err) {
      setApplyMessage({
        jobId,
        text: "Network error. Please try again.",
        type: "error",
      });
    } finally {
      setDeletingJobId(null);
      setTimeout(
        () => setApplyMessage({ jobId: null, text: "", type: "" }),
        3000,
      );
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "EXTREME WARNING: Once you choose to permanently delete your account, all your chat data, messages, and personal information will be completely removed from our system. This includes deleting the chat bar and all conversation history, and none of this data can be recovered in the future. Your account will no longer exist, and you will lose access to all associated features and content. This action is final and irreversible. Are you absolutely sure?"
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/users/profile`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/account-deleted");
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete account");
      }
    } catch (err) {
      alert("Network error. Please try again.");
    }
  };

  const appliedJobDetails = jobs.filter((j) => appliedJobs.includes(j._id));

  const filteredJobs = jobs.filter((job) => {
    // 1. Text Search
    const q = appliedFilters.query.toLowerCase();
    const matchesQuery = !q || (
      job.title?.toLowerCase().includes(q) ||
      job.tags?.some((t) => t.toLowerCase().includes(q)) ||
      job.company?.toLowerCase().includes(q) ||
      job.postedBy?.companyName?.toLowerCase().includes(q)
    );

    if (!matchesQuery) return false;

    // 2. Location Filters
    if (appliedFilters.country && job.country !== appliedFilters.country) return false;
    if (appliedFilters.state && job.state !== appliedFilters.state) return false;
    if (appliedFilters.city && job.city !== appliedFilters.city) return false;

    // 3. Work Type Filter
    if (appliedFilters.type && job.type !== appliedFilters.type) return false;

    // 4. Salary Range Filters
    if (appliedFilters.salaryRanges.length > 0) {
      const amount = job.stipendAmount || 0;
      const matchesRange = appliedFilters.salaryRanges.some((range) => {
        if (range === "1L+") return amount >= 100000;
        if (range.includes("-")) {
          const [min, max] = range.split("-").map((v) => Number(v) * 1000);
          return amount >= min && amount <= max;
        }
        // Fallback for any legacy ranges or the catch-all
        if (range === "0-10") return amount <= 10000;
        if (range === "30+") return amount > 30000;
        return false;
      });
      if (!matchesRange) return false;
    }

    return true;
  }).sort((a, b) => {
    const valA = a.stipendAmount || 0;
    const valB = b.stipendAmount || 0;
    return appliedFilters.sortOrder === "asc" ? valA - valB : valB - valA;
  });

  const navItems = [
    { id: "overview", label: "Overview", icon: IconHome },
    { id: "jobs", label: "Browse Jobs", icon: IconBriefcase },
    { id: "applied", label: "Applied Jobs", icon: IconCheck },
    { id: "submit-project", label: "Submit Project", icon: IconUpload },
    { id: "messages", label: "Messages", icon: IconMessage },
    { id: "reviews", label: "Reviews & Feedback", icon: IconStar },
    { id: "profile", label: "My Profile", icon: IconUser },
  ];

  /* ── Shared style tokens ── */
  const sidebarBg =
    "bg-white dark:bg-[#0d0a1c] border-r border-gray-200 dark:border-white/10";
  const mainBg = "bg-gray-50 dark:bg-background";
  const cardBg =
    "rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0d0a1c]";
  const innerCard =
    "bg-gray-50 dark:bg-[#100c22] border border-gray-100 dark:border-white/5";
  const textPrimary = "text-gray-900 dark:text-white";
  const textSecondary = "text-gray-500 dark:text-gray-400";
  const textMuted = "text-gray-400 dark:text-gray-500";
  const inputCls =
    "w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0d0a1c] px-12 py-3 text-gray-900 dark:text-white text-sm outline-none focus:border-brandOrange placeholder-gray-400 dark:placeholder-gray-600";

  const handleTabChange = (id) => {
    setActiveTab(id);
    setSidebarOpen(false);
  };

  return (
    <div
      className={`min-h-screen ${mainBg} flex transition-colors duration-300`}
    >
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
            <div className="w-10 h-10 rounded-2xl bg-brandOrange/20 flex items-center justify-center">
              <span className="text-brandOrange font-bold text-lg">
                {user.fullName?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p
                className={`${textPrimary} font-semibold text-sm truncate max-w-[120px]`}
              >
                {user.fullName}
              </p>
              <p className="text-xs text-brandOrange capitalize">
                {user.userType}
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => handleTabChange(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                activeTab === id
                  ? "bg-brandOrange/10 text-brandOrange border border-brandOrange/20"
                  : `${textSecondary} hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5`
              }`}
            >
              <Icon size={18} />
              {label}
              {/* {id === "applied" && appliedJobs.length > 0 && (
                <span className="ml-auto bg-brandOrange text-black text-xs font-bold px-2 py-0.5 rounded-full">
                  {appliedJobs.length}
                </span>
              )} */}
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
        <div
          className={`lg:hidden sticky top-0 z-20 flex items-center justify-between px-4 py-3 ${sidebarBg} border-b border-gray-200 dark:border-white/10`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-brandOrange/20 flex items-center justify-center shrink-0">
              <span className="text-brandOrange font-bold text-xs">
                {user.fullName?.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className={`${textPrimary} font-semibold text-sm truncate`}>
              {user.fullName}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-2">
            {/* <button
              onClick={() => navigate("/")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/10 ${textSecondary} hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all text-xs font-medium`}
            >
              <IconHome size={15} />
              Home
            </button> */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`p-2 rounded-xl border border-gray-200 dark:border-white/10 ${textSecondary}`}
            >
              {sidebarOpen ? <IconX size={20} /> : <IconMenu2 size={20} />}
            </button>
          </div>
        </div>

        <div className={activeTab === "messages" ? "h-[calc(100vh-60px)] lg:h-screen overflow-hidden px-0 pb-0" : "p-4 sm:p-6 lg:p-8"}>
          {/* Header */}
          {activeTab !== "messages" && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 lg:mb-8">
              <div>
                <h1 className={`text-xl sm:text-2xl font-bold ${textPrimary}`}>
                  Welcome back,{" "}
                  <span className="text-brandOrange">
                    {user.fullName?.split(" ")[0]}
                  </span>{" "}
                  👋
                </h1>
                <p className={`${textSecondary} text-sm mt-1`}>
                  Here's what's happening with your job search today.
                </p>
              </div>
              <button
                className={`relative p-2 rounded-xl border border-gray-200 dark:border-white/10 ${textSecondary} hover:text-gray-900 dark:hover:text-white transition-colors self-start sm:self-auto`}
              >
                <IconBell size={20} />
              </button>
            </div>
          )}

          {/* ── OVERVIEW TAB ── */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {[
                  {
                    label: "Jobs Available",
                    value: loadingJobs ? "..." : jobs.length,
                    color: "text-brandOrange",
                  },
                  ...(isFresher
                    ? [
                        {
                          label: "Applications Sent",
                          value: appliedJobs.length,
                          color: "text-purple-500 dark:text-purple-400",
                        },
                      ]
                    : [
                        {
                          label: "Account Type",
                          value: "Fresher View",
                          color: "text-purple-500 dark:text-purple-400",
                        },
                      ]),
                  {
                    label: "Skills Listed",
                    value: skills.length || 0,
                    color: "text-green-600 dark:text-green-400",
                  },
                ].map(({ label, value, color }) => (
                  <div key={label} className={`${cardBg} p-4 sm:p-5`}>
                    <p className={`${textSecondary} text-sm`}>{label}</p>
                    <p
                      className={`text-2xl sm:text-3xl font-bold mt-1 ${color}`}
                    >
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              {skills.length > 0 && (
                <div className={`${cardBg} p-4 sm:p-6`}>
                  <h2
                    className={`${textPrimary} font-semibold mb-4 flex items-center gap-2`}
                  >
                    <IconStar size={18} className="text-brandOrange" /> Your
                    Skills
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 rounded-full bg-brandOrange/10 border border-brandOrange/20 text-brandOrange text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className={`${cardBg} p-4 sm:p-6`}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className={`${textPrimary} font-semibold`}>
                    Latest Job Opportunities
                  </h2>
                  <button
                    onClick={() => handleTabChange("jobs")}
                    className="text-brandOrange text-sm flex items-center gap-1 hover:text-orange-400"
                  >
                    View all <IconChevronRight size={16} />
                  </button>
                </div>
                {loadingJobs ? (
                  <p className={`${textSecondary} text-sm`}>Loading jobs...</p>
                ) : jobs.length === 0 ? (
                  <p className={`${textSecondary} text-sm`}>
                    No jobs available right now. Check back soon!
                  </p>
                ) : (
                  <div className="space-y-3">
                    {jobs.slice(0, 3).map((job, i) => {
                      const isApplied = appliedJobs.includes(job._id);
                      const isApplying = applyingJobId === job._id;
                      return (
                        <div
                          key={job._id || i}
                          className={`flex items-start sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-xl ${innerCard} hover:border-brandOrange/20 transition-colors`}
                        >
                          <div className="min-w-0 flex-1">
                            <p className={`${textPrimary} font-medium text-sm`}>
                              {job.title || "Job Opening"}
                            </p>
                            <p className={`${textSecondary} text-xs mt-0.5`}>
                              {job.postedBy?.companyName ||
                                job.company ||
                                "Startup"}
                            </p>
                            <p
                              className={`${textMuted} text-xs mt-0.5 flex items-center gap-1`}
                            >
                              <IconClock size={12} /> {job.duration || "—"}{" "}
                              &nbsp;·&nbsp; {job.type || "remote"}
                            </p>
                            {job.stipend && (
                              <p className="text-brandOrange text-xs mt-1">
                                {job.stipend}
                              </p>
                            )}
                            {applyMessage.jobId === job._id &&
                              applyMessage.text && (
                                <p
                                  className={`text-xs mt-1 font-medium ${applyMessage.type === "success" ? "text-green-500 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}
                                >
                                  {applyMessage.text}
                                </p>
                              )}
                          </div>
                          {isFresher && (
                            <button
                              onClick={() => handleApply(job._id)}
                              disabled={isApplied || isApplying}
                              className={`text-xs px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 shrink-0 ${
                                isApplied
                                  ? "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 cursor-default"
                                  : "bg-brandOrange/10 text-brandOrange border border-brandOrange/20 hover:bg-brandOrange hover:text-black"
                              }`}
                            >
                              {isApplying ? (
                                <IconLoader2
                                  size={12}
                                  className="animate-spin"
                                />
                              ) : isApplied ? (
                                <>
                                  <IconCheck size={12} /> Applied
                                </>
                              ) : (
                                "Apply"
                              )}
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── BROWSE JOBS TAB ── */}
          {activeTab === "jobs" && (
            <div className="space-y-4">
              <div className={`${cardBg} p-4 mb-6 shadow-sm`}>
                <div className="flex flex-col gap-4">
                  {/* Top Row: Search and Button */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <IconSearch
                        className={`absolute left-4 top-1/2 -translate-y-1/2 ${textSecondary}`}
                        size={18}
                      />
                      <input
                        type="text"
                        placeholder="Search jobs by title, skills, company..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={inputCls}
                      />
                    </div>
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className={`p-3 rounded-2xl border ${showFilters ? "bg-brandOrange/10 border-brandOrange text-brandOrange" : "border-gray-200 dark:border-white/10 text-gray-500 hover:border-brandOrange/30"} transition-all`}
                      title="Toggle Filters"
                    >
                      <IconFilter size={20} />
                    </button>
                    <button
                      onClick={handleApplyFilters}
                      className="px-8 py-3 rounded-2xl bg-brandOrange text-black font-bold hover:bg-[#e65a25] transition-all flex items-center justify-center gap-2 shadow-lg shadow-brandOrange/20"
                    >
                      <IconSearch size={20} />
                      Search
                    </button>
                  </div>

                  {/* Quick Filters */}
                  {/* <div className="flex flex-wrap gap-2 pt-1">
                    {[
                      { label: "AI", value: "AI", type: "tech" },
                      { label: "React", value: "React", type: "tech" },
                      { label: "TypeScript", value: "TypeScript", type: "tech" },
                      { label: "Remote", value: "remote", type: "workMode" },
                      { label: "UI/UX", value: "UI/UX", type: "tech" },
                      { label: "Node.js", value: "Node", type: "tech" },
                    ].map((tag) => {
                      const isActive = 
                        (tag.type === "workMode" && filterState.type === tag.value) ||
                        (tag.type === "tech" && searchQuery === tag.value);
                      
                      return (
                        <button
                          key={tag.label}
                          onClick={() => handleQuickFilter(tag.type, tag.value)}
                          className={`px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                            isActive
                              ? "bg-brandOrange border-brandOrange text-black"
                              : "bg-purple-500/5 dark:bg-purple-500/10 border-purple-500/20 text-purple-600 dark:text-purple-400 hover:border-brandOrange/40 hover:bg-brandOrange/5"
                          }`}
                        >
                          {tag.label}
                        </button>
                      );
                    })}
                  </div> */}


                  {/* Bottom Row: Filter Selects (Conditional) */}
                  {showFilters && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-4 border-t border-gray-100 dark:border-white/5 animate-in fade-in slide-in-from-top-2 duration-300">
                    {/* Country */}
                    <select
                      value={filterState.country}
                      onChange={(e) => setFilterState({ ...filterState, country: e.target.value, state: "", city: "" })}
                      className={`${inputCls} !px-4 !py-2.5 h-[46px]`}
                    >
                      <option value="">All Countries</option>
                      {Country.getAllCountries().map((c) => (
                        <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
                      ))}
                    </select>

                    {/* State */}
                    <select
                      value={filterState.state}
                      onChange={(e) => setFilterState({ ...filterState, state: e.target.value, city: "" })}
                      disabled={!filterState.country}
                      className={`${inputCls} !px-4 !py-2.5 h-[46px] disabled:opacity-50`}
                    >
                      <option value="">All States</option>
                      {filterState.country && State.getStatesOfCountry(filterState.country).map((s) => (
                        <option key={s.isoCode} value={s.isoCode}>{s.name}</option>
                      ))}
                    </select>

                    {/* City */}
                    <select
                      value={filterState.city}
                      onChange={(e) => setFilterState({ ...filterState, city: e.target.value })}
                      disabled={!filterState.state}
                      className={`${inputCls} !px-4 !py-2.5 h-[46px] disabled:opacity-50`}
                    >
                      <option value="">All Cities</option>
                      {filterState.country && filterState.state && City.getCitiesOfState(filterState.country, filterState.state).map((c) => (
                        <option key={c.name} value={c.name}>{c.name}</option>
                      ))}
                    </select>

                    {/* Salary Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setShowSalaryDropdown(!showSalaryDropdown)}
                        className={`${inputCls} !px-4 !py-2.5 h-[46px] flex items-center justify-between text-left`}
                      >
                        <span className="truncate">
                          {filterState.salaryRanges.length > 0 
                            ? `${filterState.salaryRanges.length} Selected` 
                            : "Salary Range"}
                        </span>
                        <IconChevronDown size={16} className={textSecondary} />
                      </button>
                      
                      {showSalaryDropdown && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setShowSalaryDropdown(false)} />
                          <div className={`absolute top-full left-0 right-0 mt-2 p-4 z-20 ${cardBg} border border-gray-200 dark:border-white/10 shadow-xl`}>
                            <div className="space-y-3">
                              {[
                                { label: "₹0 - ₹10k", value: "0-10" },
                                { label: "₹10k - ₹20k", value: "10-20" },
                                { label: "₹20k - ₹30k", value: "20-30" },
                                { label: "₹30k - 40k", value: "30-40" },
                                { label: "₹40k - 50k", value: "40-50" },
                                { label: "₹50k - 60k", value: "50-60" },
                                { label: "₹60k - 70k", value: "60-70" },
                                { label: "₹70k - 80k", value: "70-80" },
                                { label: "₹80k - 90k", value: "80-90" },
                                { label: "₹90k - 100k", value: "90-100" },
                                { label: "₹1L+", value: "1L+" }
                              ].map((range) => (
                                <label key={range.value} className="flex items-center gap-3 cursor-pointer group">
                                  <input
                                    type="checkbox"
                                    checked={filterState.salaryRanges.includes(range.value)}
                                    onChange={(e) => {
                                      const newRanges = e.target.checked
                                        ? [...filterState.salaryRanges, range.value]
                                        : filterState.salaryRanges.filter(r => r !== range.value);
                                      setFilterState({ ...filterState, salaryRanges: newRanges });
                                    }}
                                    className="w-4 h-4 rounded border-gray-300 text-brandOrange focus:ring-brandOrange cursor-pointer"
                                  />
                                  <span className={`text-sm ${textPrimary} group-hover:text-brandOrange transition-colors`}>
                                    {range.label}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Sort Order */}
                    <div className="relative">
                      <select
                        value={filterState.sortOrder}
                        onChange={(e) => setFilterState({ ...filterState, sortOrder: e.target.value })}
                        className={`${inputCls} !px-4 !py-2.5 h-[46px] appearance-none`}
                      >
                        <option value="desc">High to Low</option>
                        <option value="asc">Low to High</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        {filterState.sortOrder === "desc" ? <IconSortDescending size={16} className={textSecondary}/> : <IconSortAscending size={16} className={textSecondary}/>}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
              {loadingJobs ? (
                <p className={textSecondary}>Loading jobs...</p>
              ) : filteredJobs.length === 0 ? (
                <div className="text-center py-16">
                  <IconBriefcase
                    size={48}
                    className="text-gray-300 dark:text-gray-600 mx-auto mb-4"
                  />
                  <p className={textSecondary}>No jobs found.</p>
                </div>
              ) : (
                filteredJobs.map((job, i) => {
                  const isApplied = appliedJobs.includes(job._id);
                  const isApplying = applyingJobId === job._id;
                  return (
                    <div
                      key={job._id || i}
                      className={`${cardBg} p-4 sm:p-5 hover:border-brandOrange/30 transition-colors`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className={`${textPrimary} font-semibold`}>
                            {job.title}
                          </h3>
                          <p
                            className={`${textSecondary} text-sm mt-1 flex items-center gap-1`}
                          >
                            <IconBuilding size={13} />
                            {job.postedBy?.companyName ||
                              job.company ||
                              "Startup"}
                          </p>
                            <div
                              className={`flex items-center gap-3 sm:gap-4 mt-2 text-xs ${textMuted} flex-wrap`}
                            >
                              <span className="flex items-center gap-1 capitalize">
                                <IconClock size={12} />
                                {job.type || "remote"}
                              </span>
                              {(job.country || job.city) && (
                                <span className="flex items-center gap-1">
                                  <IconWorld size={12} />
                                  {[job.city, job.state, job.country].filter(Boolean).join(", ")}
                                </span>
                              )}
                              {job.duration && <span>{job.duration}</span>}
                              {job.stipend && (
                                <span className="text-brandOrange font-medium">
                                  {job.stipend}
                                </span>
                              )}
                            </div>
                          {job.tags && job.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-3">
                              {job.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 text-xs"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                          {job.description && (
                            <p
                              className={`${textSecondary} text-sm mt-3 line-clamp-2`}
                            >
                              {job.description}
                            </p>
                          )}
                          {job.postedBy && (
                            <div
                              className={`mt-2 flex flex-wrap gap-3 text-xs ${textMuted}`}
                            >
                              {job.postedBy.email && (
                                <span className="flex items-center gap-1">
                                  <IconMail size={12} />
                                  <span className="truncate max-w-[160px] sm:max-w-none">
                                    {job.postedBy.email}
                                  </span>
                                </span>
                              )}
                              {job.postedBy.website && (
                                <span className="flex items-center gap-1">
                                  <IconWorld size={12} />
                                  {job.postedBy.website}
                                </span>
                              )}
                            </div>
                          )}
                          {applyMessage.jobId === job._id &&
                            applyMessage.text && (
                              <p
                                className={`text-xs mt-2 font-medium ${applyMessage.type === "success" ? "text-green-500 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}
                              >
                                {applyMessage.text}
                              </p>
                            )}
                        </div>
                        {isFresher && (
                          <div className="flex items-center gap-2">
                            {isApplied && (
                              <button
                                onClick={() => handleDeleteApplication(job._id)}
                                disabled={deletingJobId === job._id}
                                className="shrink-0 px-4 flex items-center font-semibold bg-red-500/10 gap-2 text-xs sm:text-sm py-2 rounded-xl text-red-500 border border-red-500/20 hover:bg-red-500/10 transition-colors disabled:opacity-60"
                                title="Delete Application"
                              >
                                {deletingJobId === job._id ? (
                                  <IconLoader2
                                    size={15}
                                    className="animate-spin"
                                  />
                                ) : (
                                  <IconTrash size={18} stroke={1.8} />
                                )}{" "}
                                Delete
                              </button>
                            )}
                            <button
                              onClick={() => handleApply(job._id)}
                              disabled={isApplied || isApplying}
                              className={`shrink-0 px-3 sm:px-4 py-2  rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1 sm:gap-2 ${
                                isApplied
                                  ? "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 cursor-default"
                                  : "bg-brandOrange text-black hover:bg-[#e65a25] disabled:opacity-60"
                              }`}
                            >
                              {isApplying ? (
                                <>
                                  <IconLoader2
                                    size={15}
                                    className="animate-spin"
                                  />
                                  Applying...
                                </>
                              ) : isApplied ? (
                                <>
                                  <IconCheck size={18} />
                                  Applied
                                </>
                              ) : (
                                "Apply Now"
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* ── APPLIED JOBS TAB ── */}
          {activeTab === "applied" && isFresher && (
            <div className="space-y-4">
              <h2 className={`${textPrimary} font-semibold text-lg`}>
                My Applications ({appliedJobDetails.length})
              </h2>
              {appliedJobDetails.length === 0 ? (
                <div className="text-center py-16">
                  <IconBriefcase
                    size={48}
                    className="text-gray-300 dark:text-gray-600 mx-auto mb-4"
                  />
                  <p className={`${textSecondary} mb-4`}>
                    You haven't applied to any jobs yet.
                  </p>
                  <button
                    onClick={() => handleTabChange("jobs")}
                    className="px-6 py-2.5 rounded-xl bg-brandOrange text-black font-semibold text-sm hover:bg-[#e65a25] transition-colors"
                  >
                    Browse Jobs
                  </button>
                </div>
              ) : (
                appliedJobDetails.map((job, i) => (
                  <div
                    key={job._id || i}
                    className="rounded-2xl border border-green-500/20 bg-white dark:bg-[#0d0a1c] p-4 sm:p-5"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0 mt-0.5">
                        <IconCheck
                          size={16}
                          className="text-green-500 dark:text-green-400"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`${textPrimary} font-semibold`}>
                          {job.title}
                        </h3>
                        <div className={`mt-3 rounded-xl ${innerCard} p-3`}>
                          <p
                            className={`text-xs ${textMuted} uppercase tracking-widest mb-2`}
                          >
                            Company Info
                          </p>
                          <p
                            onClick={() => job.postedBy?._id && navigate(`/profile/${job.postedBy._id}`)}
                            className={`${textPrimary} text-sm font-medium flex items-center gap-2 cursor-pointer hover:text-brandOrange transition-colors`}
                          >
                            <IconBuilding
                              size={14}
                              className="text-brandOrange shrink-0"
                            />
                            {job.postedBy?.companyName ||
                              job.company ||
                              "Startup"}
                          </p>
                          {job.postedBy?.email && (
                            <p
                              className={`${textSecondary} text-xs mt-1 flex items-center gap-2`}
                            >
                              <IconMail size={12} className={textMuted} />{" "}
                              <span className="truncate">
                                {job.postedBy.email}
                              </span>
                            </p>
                          )}
                          {job.postedBy?.website && (
                            <p
                              className={`${textSecondary} text-xs mt-1 flex items-center gap-2`}
                            >
                              <IconWorld size={12} className={textMuted} />{" "}
                              {job.postedBy.website}
                            </p>
                          )}
                        </div>
                        <div
                          className={`flex items-center gap-3 sm:gap-4 mt-3 text-xs ${textMuted} flex-wrap`}
                        >
                          <span className="flex items-center gap-1 capitalize">
                            <IconClock size={12} />
                            {job.type || "remote"}
                          </span>
                          {job.duration && <span>{job.duration}</span>}
                          {job.stipend && (
                            <span className="text-brandOrange font-medium">
                              {job.stipend}
                            </span>
                          )}
                        </div>
                        {job.tags && job.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {job.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        {applyMessage.jobId === job._id &&
                          applyMessage.text && (
                            <p
                              className={`text-xs mt-2 font-medium ${applyMessage.type === "success" ? "text-green-500 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}
                            >
                              {applyMessage.text}
                            </p>
                          )}
                      </div>
                      <div className="flex flex-col gap-2 shrink-0">
                        {job.postedBy?._id && (
                          <button
                            onClick={() =>
                              handleInitiateChat(job.postedBy._id, job._id)
                            }
                            className="p-2 rounded-xl bg-green-500/10 flex items-center justify-center gap-1 text-green-500 hover:bg-green-500/20 transition-colors shrink-0"
                            title="Message Company"
                          >
                            <IconMessage size={20} stroke={1.5} /> Message
                          </button>
                        )}
                        <button
                          onClick={() => setActiveTab("reviews")}
                          className="p-2 rounded-xl bg-brandOrange/10 flex items-center justify-center gap-1 text-brandOrange hover:bg-brandOrange hover:text-black transition-all shrink-0 font-medium"
                          title="Rate your experience"
                        >
                          <IconStar size={20} stroke={1.5} /> Feedback
                        </button>
                        <button
                          onClick={() => handleDeleteApplication(job._id)}
                          disabled={deletingJobId === job._id}
                          className="p-2 rounded-xl flex items-center bg-red-500/10 justify-center gap-1 hover:bg-red-500/20 text-red-500 dark:text-red-400 transition-colors disabled:opacity-60 shrink-0"
                          title="Withdraw Application"
                        >
                          {deletingJobId === job._id ? (
                            <IconLoader2 size={18} className="animate-spin" />
                          ) : (
                            <IconTrash size={20} stroke={1.5} />
                          )}
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ── SUBMIT PROJECT TAB ── */}
          {activeTab === "submit-project" && isFresher && (
            <div className="max-w-xl space-y-6">
              <div className={`${cardBg} p-4 sm:p-6`}>
                <h2 className={`${textPrimary} font-semibold mb-6`}>
                  Resume and Project
                </h2>
                {projectMessage.text && (
                  <div
                    className={`mb-4 rounded-xl px-4 py-3 text-sm border ${
                      projectMessage.type === "success"
                        ? "bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400"
                        : "bg-red-500/10 border-red-500/30 text-red-500 dark:text-red-400"
                    }`}
                  >
                    {projectMessage.text}
                  </div>
                )}
                <form className="space-y-4" onSubmit={handleProjectSubmit}>
                  {/* Pre-filled info (readOnly) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-gray-400 uppercase tracking-widest">
                        Name
                      </label>
                      <input
                        type="text"
                        value={projectForm.name}
                        readOnly
                        className={`${inputCls} opacity-70 cursor-not-allowed`}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-gray-400 uppercase tracking-widest">
                        Email
                      </label>
                      <input
                        type="email"
                        value={projectForm.email}
                        readOnly
                        className={`${inputCls} opacity-70 cursor-not-allowed`}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-400 uppercase tracking-widest">
                      Phone
                    </label>
                    <input
                      type="text"
                      value={projectForm.phone}
                      onChange={(e) =>
                        setProjectForm({
                          ...projectForm,
                          phone: e.target.value,
                        })
                      }
                      className={inputCls}
                      placeholder="Your mobile number"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-400 uppercase tracking-widest">
                      Project Title
                    </label>
                    <input
                      type="text"
                      value={projectForm.projectTitle}
                      onChange={(e) =>
                        setProjectForm({
                          ...projectForm,
                          projectTitle: e.target.value,
                        })
                      }
                      className={inputCls}
                      placeholder="e.g. E-Commerce Backend"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-400 uppercase tracking-widest">
                      Description
                    </label>
                    <textarea
                      rows="4"
                      value={projectForm.description}
                      onChange={(e) =>
                        setProjectForm({
                          ...projectForm,
                          description: e.target.value,
                        })
                      }
                      className={`${inputCls} resize-none `}
                      placeholder="Describe your project, technologies used, etc."
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-400 uppercase tracking-widest">
                      Resume and Project (PDF, ZIP, Word, Images)
                    </label>
                    <input
                      id="projectFileInput"
                      type="file"
                      multiple
                      onChange={handleProjectFileChange}
                      className={`w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0d0a1c] px-2 py-3 text-gray-900 dark:text-white text-sm outline-none focus:border-brandOrange`}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Maximum 5 files. Max size 10MB per file.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={projectSubmitting}
                    className="w-full py-3 rounded-xl bg-brandOrange text-black font-semibold hover:bg-[#e65a25] transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-4"
                  >
                    {projectSubmitting ? (
                      <>
                        <IconLoader2 size={18} className="animate-spin" />{" "}
                        Submitting...
                      </>
                    ) : (
                      "Submit "
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ── MESSAGES TAB ── */}
          {activeTab === "messages" && (
            <div className="h-full">
              <ChatInterface user={user} />
            </div>
          )}

          {/* ── REVIEWS & FEEDBACK TAB ── */}
          {activeTab === "reviews" && (
            <DashboardFeedbackTab user={user} />
          )}

          {/* ── PROFILE TAB ── */}
          {activeTab === "profile" && (
            <div className="max-w-xl space-y-6">
              <div className={`${cardBg} p-4 sm:p-6`}>
                <h2 className={`${textPrimary} font-semibold mb-6`}>
                  Profile Information
                </h2>
                <div className="space-y-4">
                  {[
                    { label: "Full Name", value: user.fullName },
                    { label: "Email", value: user.email },
                    { label: "Phone", value: user.phone || "Not provided" },
                    { label: "Skills", value: user.skills || "Not provided" },
                    { label: "Account Type", value: "Fresher" },
                    ...(isFresher
                      ? [
                          {
                            label: "Applications Sent",
                            value: String(appliedJobs.length),
                          },
                        ]
                      : []),
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className={`flex flex-col gap-1 pb-4 border-b border-gray-100 dark:border-white/5 last:border-0`}
                    >
                      <span
                        className={`text-xs ${textMuted} uppercase tracking-widest`}
                      >
                        {label}
                      </span>
                      <span className={`${textPrimary} text-sm break-all font-medium`}>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* My Profile Link Button - Based on user request image */}
                <button 
                  onClick={() => navigate(`/profile/${user._id || user.id}`)}
                  className="mt-8 w-full flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-white/5 hover:bg-brandOrange/10 border border-gray-100 dark:border-white/5 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#100c22] border border-gray-100 dark:border-white/5 flex items-center justify-center shadow-sm group-hover:border-brandOrange/30 transition-colors">
                    <IconUser className="text-gray-400 group-hover:text-brandOrange" size={22} />
                  </div>
                  <span className="text-[#0038A8] dark:text-blue-400 font-bold text-lg">My Profile</span>
                </button>

                {/* Delete Account Button */}
                <button
                  onClick={handleDeleteAccount}
                  className="mt-4 w-full flex items-center gap-4 p-4 rounded-2xl bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 border border-red-100 dark:border-red-900/30 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#100c22] border border-red-100 dark:border-red-900/30 flex items-center justify-center shadow-sm group-hover:border-red-500 transition-colors">
                    <IconTrash
                      className="text-red-400 group-hover:text-red-600"
                      size={22}
                    />
                  </div>
                  <span className="text-red-600 dark:text-red-400 font-bold text-lg">
                    Delete My Account
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default FresherDashboard;
