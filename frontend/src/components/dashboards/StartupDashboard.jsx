import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconBriefcase,
  IconUser,
  IconLogout,
  IconHome,
  IconFolder,
  IconDownload,
  IconBell,
  IconPlus,
  IconUsers,
  IconBuilding,
  IconWorld,
  IconTrash,
  IconLoader2,
  IconMail,
  IconPhone,
  IconChevronDown,
  IconChevronUp,
  IconCode,
  IconSun,
  IconMoon,
  IconMenu2,
  IconX,
  IconMessage,
  IconStar,
  IconSortAscending,
  IconSortDescending,
  IconFilter,
} from "@tabler/icons-react";
import { useTheme } from "../../context/ThemeContext";
import ChatInterface from "../chat/ChatInterface";
import { Country, State, City } from "country-state-city";
import DashboardFeedbackTab from "../profile/DashboardFeedbackTab";

const StartupDashboard = ({ user, onLogout, setCurrentPage }) => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [showPostForm, setShowPostForm] = useState(false);
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState("");
  const [postSuccess, setPostSuccess] = useState("");
  const [expandedJobId, setExpandedJobId] = useState(null);
  const [deletingApplicantId, setDeletingApplicantId] = useState(null);
  const [deletingJobId, setDeletingJobId] = useState(null);
  const [deletingProjectId, setDeletingProjectId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: user.fullName || "",
    companyName: user.companyName || "",
    website: user.website || "",
    companyAddress: user.companyAddress || "",
    lat: user.location?.lat || "",
    lng: user.location?.lng || "",
  });
  const [jobForm, setJobForm] = useState({
    title: "",
    description: "",
    duration: "",
    stipend: "",
    stipendAmount: "",
    type: "remote",
    tags: "",
    country: "",
    state: "",
    city: "",
  });

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

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/jobs/startup/my-jobs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);
      } else {
        const res2 = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/jobs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res2.ok) {
          const data2 = await res2.json();
          setJobs(data2.jobs || []);
        }
      }
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
    } finally {
      setLoadingJobs(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
      }
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    } finally {
      setLoadingProjects(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchProjects();
  }, []);

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;
    setDeletingProjectId(projectId);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/projects/${projectId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchProjects();
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete project");
      }
    } catch (err) {
      alert("Network error. Please try again.");
    } finally {
      setDeletingProjectId(null);
    }
  };

  const handleJobFormChange = (e) => {
    const { name, value } = e.target;
    setJobForm((prev) => ({ ...prev, [name]: value }));
    setPostError("");
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    if (!jobForm.title || !jobForm.description)
      return setPostError("Title and description are required.");

    setPosting(true);
    setPostError("");
    setPostSuccess("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: jobForm.title,
          description: jobForm.description,
          type: jobForm.type,
          duration: jobForm.duration,
          stipend: jobForm.stipend,
          stipendAmount: Number(jobForm.stipendAmount) || 0,
          country: jobForm.country,
          state: jobForm.state,
          city: jobForm.city,
          tags: jobForm.tags
            ? jobForm.tags.split(",").map((t) => t.trim())
            : [],
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to post job");

      setPostSuccess("Job posted successfully!");
      setJobForm({
        title: "",
        description: "",
        duration: "",
        stipend: "",
        stipendAmount: "",
        type: "remote",
        tags: "",
        country: "",
        state: "",
        city: "",
      });
      setShowPostForm(false);
      fetchJobs();
    } catch (err) {
      setPostError(err.message);
    } finally {
      setPosting(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this job? All applications will be removed.",
      )
    )
      return;
    setDeletingJobId(jobId);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/jobs/${jobId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchJobs();
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete job");
      }
    } catch (err) {
      alert("Network error. Please try again.");
    } finally {
      setDeletingJobId(null);
    }
  };

  const handleDeleteApplication = async (jobId, applicantId) => {
    setDeletingApplicantId(applicantId);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/jobs/${jobId}/application/${applicantId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchJobs(); // Refresh jobs to get updated applicant list
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

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: profileData.fullName,
          companyName: profileData.companyName,
          website: profileData.website,
          companyAddress: profileData.companyAddress,
          location: {
            lat: profileData.lat ? parseFloat(profileData.lat) : undefined,
            lng: profileData.lng ? parseFloat(profileData.lng) : undefined,
          },
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Profile updated successfully!");
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        const updatedUser = { ...storedUser, ...data.user };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } else {
        alert(data.message || "Failed to update profile");
      }
    } catch (err) {
      alert("Network error. Please try again.");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
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

  const totalApplicants = jobs.reduce(
    (sum, j) => sum + (j.applicants?.length || 0),
    0,
  );

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
  const formInput =
    "rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#100c22] px-4 py-2.5 text-gray-900 dark:text-white text-sm outline-none focus:border-brandOrange placeholder-gray-400 dark:placeholder-gray-600 w-full transition-colors";
  const formLabel =
    "text-xs text-gray-400 dark:text-gray-400 uppercase tracking-widest";

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
              <p className="text-xs text-brandOrange capitalize truncate">
                {user.companyName || user.userType}
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: "overview", label: "Overview", icon: IconHome },
            { id: "jobs", label: "My Job Posts", icon: IconBriefcase },
            { id: "applicants", label: "Applicants", icon: IconUsers },
            { id: "projects", label: "Submitted Resume", icon: IconFolder },
            { id: "messages", label: "Messages", icon: IconMessage },
            { id: "reviews", label: "Reviews & Feedback", icon: IconStar },
            { id: "profile", label: "Company Profile", icon: IconBuilding },
          ].map(({ id, label, icon: Icon }) => (
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
              {/* {id === "applicants" && totalApplicants > 0 && (
                <span className="ml-auto bg-brandOrange text-black text-xs font-bold px-2 py-0.5 rounded-full">
                  {totalApplicants}
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
              {user.companyName || user.fullName}
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

        <div
          className={
            activeTab === "messages"
              ? "h-[calc(100vh-60px)] lg:h-screen overflow-hidden px-0 pb-0"
              : "p-4 sm:p-6 lg:p-8"
          }
        >
          {/* Header */}
          {activeTab !== "messages" && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 lg:mb-8">
              <div>
                <h1 className={`text-xl sm:text-2xl font-bold ${textPrimary}`}>
                  Welcome,{" "}
                  <span className="text-brandOrange">
                    {user.companyName || user.fullName?.split(" ")[0]}
                  </span>{" "}
                  🚀
                </h1>
                <p className={`${textSecondary} text-sm mt-1`}>
                  Manage your job listings and find the best talent.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowPostForm(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brandOrange text-black font-semibold text-sm hover:bg-[#e65a25] transition-colors"
                >
                  <IconPlus size={16} /> Post a Job
                </button>
                <button
                  className={`relative p-2 rounded-xl border border-gray-200 dark:border-white/10 ${textSecondary} hover:text-gray-900 dark:hover:text-white transition-colors`}
                >
                  <IconBell size={20} />
                </button>
              </div>
            </div>
          )}

          {/* Post Job Modal */}
          {showPostForm && (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-[#0d0a1c] border border-gray-200 dark:border-white/10 rounded-[32px] p-6 sm:p-8 w-full max-w-lg shadow-2xl transition-colors duration-300 max-h-[90vh] overflow-y-auto">
                <h2 className={`${textPrimary} font-bold text-xl mb-6`}>
                  Post a New Job
                </h2>
                {postError && (
                  <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-red-500 dark:text-red-400 text-sm">
                    {postError}
                  </div>
                )}
                <form className="space-y-4" onSubmit={handlePostJob}>
                  {[
                    {
                      name: "title",
                      label: "Job Title",
                      placeholder: "e.g. Frontend Developer",
                    },
                    {
                      name: "duration",
                      label: "Duration",
                      placeholder: "e.g. 3 months",
                    },
                    {
                      name: "stipend",
                      label: "Stipend / Salary",
                      placeholder: "e.g. ₹15k/mo or Unpaid",
                    },
                    {
                      name: "tags",
                      label: "Skills / Tags (comma separated)",
                      placeholder: "e.g. React, Node.js, Python",
                    },
                  ].map(({ name, label, placeholder }) => (
                    <div key={name} className="flex flex-col gap-1">
                      <label className={formLabel}>{label}</label>
                      <input
                        type="text"
                        name={name}
                        value={jobForm[name]}
                        onChange={handleJobFormChange}
                        placeholder={placeholder}
                        className={formInput}
                      />
                    </div>
                  ))}
                  <div className="flex flex-col gap-1">
                    <label className={formLabel}>
                      Stipend Amount (Numeric for filtering)
                    </label>
                    <input
                      type="number"
                      name="stipendAmount"
                      value={jobForm.stipendAmount}
                      onChange={handleJobFormChange}
                      placeholder="e.g. 15000"
                      className={formInput}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className={formLabel}>Country</label>
                      <select
                        name="country"
                        value={jobForm.country}
                        onChange={handleJobFormChange}
                        className={formInput}
                      >
                        <option value="">Select Country</option>
                        {Country.getAllCountries().map((c) => (
                          <option key={c.isoCode} value={c.isoCode}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className={formLabel}>State</label>
                      <select
                        name="state"
                        value={jobForm.state}
                        onChange={handleJobFormChange}
                        className={formInput}
                        disabled={!jobForm.country}
                      >
                        <option value="">Select State</option>
                        {jobForm.country &&
                          State.getStatesOfCountry(jobForm.country).map((s) => (
                            <option key={s.isoCode} value={s.isoCode}>
                              {s.name}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className={formLabel}>City</label>
                      <select
                        name="city"
                        value={jobForm.city}
                        onChange={handleJobFormChange}
                        className={formInput}
                        disabled={!jobForm.state}
                      >
                        <option value="">Select City</option>
                        {jobForm.country &&
                          jobForm.state &&
                          City.getCitiesOfState(
                            jobForm.country,
                            jobForm.state,
                          ).map((c) => (
                            <option key={c.name} value={c.name}>
                              {c.name}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className={formLabel}>Work Type</label>
                    <select
                      name="type"
                      value={jobForm.type}
                      onChange={handleJobFormChange}
                      className={formInput}
                    >
                      {["remote", "onsite", "hybrid"].map((t) => (
                        <option
                          key={t}
                          value={t}
                          className="capitalize bg-white dark:bg-[#100c22]"
                        >
                          {t.charAt(0).toUpperCase() + t.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className={formLabel}>Description</label>
                    <textarea
                      name="description"
                      value={jobForm.description}
                      onChange={handleJobFormChange}
                      placeholder="Describe the role, responsibilities, and requirements..."
                      rows={4}
                      className={`${formInput} resize-none`}
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowPostForm(false)}
                      className={`flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 ${textSecondary} hover:text-gray-900 dark:hover:text-white transition-colors text-sm`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={posting}
                      className="flex-1 py-2.5 rounded-xl bg-brandOrange text-black font-semibold text-sm hover:bg-[#e65a25] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {posting ? (
                        <>
                          <IconLoader2 size={16} className="animate-spin" />{" "}
                          Posting...
                        </>
                      ) : (
                        "Post Job"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {postSuccess && (
                <div className="rounded-xl bg-green-500/10 border border-green-500/30 px-4 py-3 text-green-600 dark:text-green-400 text-sm">
                  {postSuccess}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {[
                  {
                    label: "Jobs Posted",
                    value: loadingJobs ? "..." : jobs.length,
                    color: "text-brandOrange",
                  },
                  {
                    label: "Total Applicants",
                    value: loadingJobs ? "..." : totalApplicants,
                    color: "text-purple-500 dark:text-purple-400",
                  },
                  {
                    label: "Account Status",
                    value: "Active",
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
              <div className={`${cardBg} p-4 sm:p-6`}>
                <h2 className={`${textPrimary} font-semibold mb-4`}>
                  Quick Actions
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => setShowPostForm(true)}
                    className="flex items-center gap-3 p-4 rounded-xl bg-brandOrange/10 border border-brandOrange/20 text-brandOrange hover:bg-brandOrange/20 transition-colors text-sm font-medium"
                  >
                    <IconPlus size={18} /> Post New Job
                  </button>
                  <button
                    onClick={() => handleTabChange("applicants")}
                    className={`flex items-center gap-3 p-4 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 ${textSecondary} hover:text-gray-900 dark:hover:text-white transition-colors text-sm font-medium`}
                  >
                    <IconUsers size={18} /> View Applicants
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Jobs Tab */}
          {activeTab === "jobs" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h2 className={`${textPrimary} font-semibold`}>
                  Your Job Listings
                </h2>
                <button
                  onClick={() => setShowPostForm(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brandOrange text-black font-semibold text-sm hover:bg-[#e65a25] transition-colors self-start sm:self-auto"
                >
                  <IconPlus size={16} /> Post Job
                </button>
              </div>
              {postSuccess && (
                <div className="rounded-xl bg-green-500/10 border border-green-500/30 px-4 py-3 text-green-600 dark:text-green-400 text-sm">
                  {postSuccess}
                </div>
              )}
              {loadingJobs ? (
                <p className={textSecondary}>Loading...</p>
              ) : jobs.length === 0 ? (
                <div className="text-center py-16">
                  <IconBriefcase
                    size={48}
                    className="text-gray-300 dark:text-gray-600 mx-auto mb-4"
                  />
                  <p className={`${textSecondary} mb-4`}>
                    You haven't posted any jobs yet.
                  </p>
                  <button
                    onClick={() => setShowPostForm(true)}
                    className="px-6 py-2.5 rounded-xl bg-brandOrange text-black font-semibold text-sm hover:bg-[#e65a25] transition-colors"
                  >
                    Post Your First Job
                  </button>
                </div>
              ) : (
                jobs.map((job, i) => (
                  <div key={job._id || i} className={`${cardBg} p-4 sm:p-5`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className={`${textPrimary} font-semibold`}>
                          {job.title}
                        </h3>
                        <p className={`${textSecondary} text-xs mt-1`}>
                          {job.type || "Remote"} · {job.duration || "—"}
                        </p>
                        {job.description && (
                          <p
                            className={`${textSecondary} text-sm mt-2 line-clamp-2`}
                          >
                            {job.description}
                          </p>
                        )}
                        <p className="text-purple-500 dark:text-purple-400 text-xs mt-2 flex items-center gap-1">
                          <IconUsers size={12} /> {job.applicants?.length || 0}{" "}
                          applicant{job.applicants?.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <div className="flex  flex-col items-end gap-2 shrink-0">
                        <span className="px-2  flex  sm:px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-xs">
                          Active
                        </span>
                        <button
                          onClick={() => handleDeleteJob(job._id)}
                          disabled={deletingJobId === job._id}
                          className="px-2 sm:px-4 py-1.5 rounded-full border border-red-500/20 bg-red-500/10 flex items-center text-xs gap-1 text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                          title="Delete Job"
                        >
                          {deletingJobId === job._id ? Delete : <>Delete</>}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Applicants Tab */}
          {activeTab === "applicants" && (
            <div className="space-y-4">
              <h2 className={`${textPrimary} font-semibold text-lg`}>
                Applications Received
              </h2>
              {loadingJobs ? (
                <p className={textSecondary}>Loading...</p>
              ) : jobs.length === 0 ? (
                <div className="text-center py-16">
                  <IconUsers
                    size={48}
                    className="text-gray-300 dark:text-gray-600 mx-auto mb-4"
                  />
                  <p className={textSecondary}>No jobs posted yet.</p>
                </div>
              ) : (
                jobs.map((job) => (
                  <div key={job._id} className={`${cardBg} overflow-hidden`}>
                    <button
                      onClick={() =>
                        setExpandedJobId(
                          expandedJobId === job._id ? null : job._id,
                        )
                      }
                      className={`w-full flex items-center justify-between p-4 sm:p-5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-brandOrange/10 border border-brandOrange/20 flex items-center justify-center shrink-0">
                          <IconBriefcase
                            size={16}
                            className="text-brandOrange"
                          />
                        </div>
                        <div className="text-left min-w-0">
                          <p
                            className={`${textPrimary} font-semibold text-sm sm:text-base truncate`}
                          >
                            {job.title}
                          </p>
                          <p className={`${textSecondary} text-xs mt-0.5`}>
                            {job.type} · {job.duration || "—"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-2">
                        <span
                          className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                            job.applicants?.length > 0
                              ? "bg-purple-500/10 border border-purple-500/20 text-purple-500 dark:text-purple-400"
                              : "bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-400"
                          }`}
                        >
                          {job.applicants?.length || 0} applicant
                          {job.applicants?.length !== 1 ? "s" : ""}
                        </span>
                        {expandedJobId === job._id ? (
                          <IconChevronUp size={16} className={textMuted} />
                        ) : (
                          <IconChevronDown size={16} className={textMuted} />
                        )}
                      </div>
                    </button>

                    {expandedJobId === job._id && (
                      <div className="border-t border-gray-100 dark:border-white/5 p-4 sm:p-5">
                        {!job.applicants || job.applicants.length === 0 ? (
                          <p
                            className={`${textMuted} text-sm text-center py-4`}
                          >
                            No applications yet for this job.
                          </p>
                        ) : (
                          <div className="space-y-3">
                            {job.applicants.map((applicant, idx) => (
                              <div
                                key={applicant._id || idx}
                                className={`flex items-start justify-between gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl ${innerCard}`}
                              >
                                <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                                  <div className="w-10 h-10 rounded-2xl bg-purple-500/20 flex items-center justify-center shrink-0">
                                    <span className="text-purple-500 dark:text-purple-400 font-bold text-sm">
                                      {applicant.fullName
                                        ?.charAt(0)
                                        .toUpperCase() || "?"}
                                    </span>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p
                                      onClick={() =>
                                        navigate(`/profile/${applicant._id}`)
                                      }
                                      className={`${textPrimary} font-semibold text-sm cursor-pointer hover:text-brandOrange transition-colors`}
                                    >
                                      {applicant.fullName || "Applicant"}
                                    </p>
                                    {applicant.email && (
                                      <p
                                        className={`${textSecondary} text-xs mt-0.5 flex items-center gap-1`}
                                      >
                                        <IconMail size={11} />{" "}
                                        <span className="truncate">
                                          {applicant.email}
                                        </span>
                                      </p>
                                    )}
                                    {applicant.phone && (
                                      <p
                                        className={`${textSecondary} text-xs mt-0.5 flex items-center gap-1`}
                                      >
                                        <IconPhone size={11} />{" "}
                                        {applicant.phone}
                                      </p>
                                    )}
                                    {applicant.skills && (
                                      <div className="flex flex-wrap gap-1 mt-2">
                                        {applicant.skills
                                          .split(",")
                                          .map((s) => (
                                            <span
                                              key={s.trim()}
                                              className="px-2 py-0.5 rounded-full bg-brandOrange/10 border border-brandOrange/20 text-brandOrange text-xs flex items-center gap-1"
                                            >
                                              <IconCode size={10} />
                                              {s.trim()}
                                            </span>
                                          ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="flex flex-col gap-2 shrink-0">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleInitiateChat(
                                        applicant._id,
                                        job._id,
                                      );
                                    }}
                                    className="p-2 rounded-xl flex items-center justify-center gap-1 text-green-500 bg-green-500/10 hover:bg-green-500/20 transition-colors"
                                    title="Message Applicant"
                                  >
                                    <IconMessage size={18} stroke={1.5} />{" "}
                                    Message
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveTab("reviews");
                                    }}
                                    className="p-2 rounded-xl flex items-center justify-center gap-1 text-brandOrange bg-brandOrange/10 hover:bg-brandOrange/20 hover:text-orange transition-all font-medium"
                                    title="Give Feedback"
                                  >
                                    <IconStar size={18} stroke={1.5} /> Feedback
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (
                                        window.confirm(
                                          `Are you sure you want to delete ${applicant.fullName || "this applicant"}'s application?`,
                                        )
                                      ) {
                                        handleDeleteApplication(
                                          job._id,
                                          applicant._id,
                                        );
                                      }
                                    }}
                                    disabled={
                                      deletingApplicantId === applicant._id
                                    }
                                    className="p-2 rounded-xl flex bg-red-500/10 items-center justify-center gap-1 text-red-500 dark:text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                                    title="Delete Application"
                                  >
                                    {deletingApplicantId === applicant._id ? (
                                      <IconLoader2
                                        size={18}
                                        className="animate-spin"
                                      />
                                    ) : (
                                      <IconTrash size={18} stroke={1.5} />
                                    )}{" "}
                                    Delete
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Projects Tab */}
          {activeTab === "projects" && (
            <div className="space-y-4">
              <h2 className={`${textPrimary} font-semibold text-lg`}>
                Resumes & Projects Submitted by Applicants
              </h2>
              {loadingProjects ? (
                <p className={textSecondary}>Loading...</p>
              ) : projects.length === 0 ? (
                <div className="text-center py-16">
                  <IconFolder
                    size={48}
                    className="text-gray-300 dark:text-gray-600 mx-auto mb-4"
                  />
                  <p className={textSecondary}>No projects submitted yet.</p>
                </div>
              ) : (
                projects.map((project) => (
                  <div
                    key={project._id}
                    className={`${cardBg} p-4 sm:p-5 transition-colors`}
                  >
                    <div className="flex flex-col sm:flex-row gap-4 items-start">
                      <div className="w-12 h-12 rounded-2xl bg-brandOrange/10 border border-brandOrange/20 flex flex-col items-center justify-center shrink-0 mt-1">
                        <span className="text-brandOrange font-bold text-lg">
                          {project.name?.charAt(0).toUpperCase() || "?"}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0 w-full">
                        <div className="flex justify-between items-start gap-4">
                          <h3
                            className={`${textPrimary} font-semibold text-lg break-words`}
                          >
                            {project.projectTitle}
                          </h3>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteProject(project._id);
                            }}
                            disabled={deletingProjectId === project._id}
                            className="p-2 rounded-xl flex shrink-0 items-center justify-center text-red-500 bg-red-500/10 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                            title="Delete Project"
                          >
                            {deletingProjectId === project._id ? (
                              <IconLoader2 size={18} className="animate-spin" />
                            ) : (
                              <IconTrash size={18} stroke={1.5} />
                            )}
                          </button>
                        </div>
                        <p
                          className={`${textSecondary} text-sm mt-2 whitespace-pre-wrap`}
                        >
                          {project.description}
                        </p>

                        <div
                          className={`mt-4 rounded-xl ${innerCard} p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 gap-4`}
                        >
                          <div className="flex flex-col gap-1 min-w-0">
                            <span className="text-[10px] uppercase tracking-widest text-gray-500">
                              Submitted By
                            </span>
                            <span
                              className={`${textPrimary} text-sm font-medium truncate`}
                            >
                              {project.name}
                            </span>
                          </div>
                          <div className="flex flex-col gap-2 min-w-0">
                            <span className="text-[10px] uppercase tracking-widest text-gray-500">
                              Contact Details
                            </span>
                            <span
                              className={`${textPrimary} text-sm flex items-center gap-2 truncate`}
                            >
                              <IconMail
                                size={14}
                                className="text-gray-400 shrink-0"
                              />{" "}
                              <span className="truncate">{project.email}</span>
                            </span>
                            <span
                              className={`${textPrimary} text-sm flex items-center gap-2`}
                            >
                              <IconPhone
                                size={14}
                                className="text-gray-400 shrink-0"
                              />{" "}
                              {project.phone}
                            </span>
                          </div>
                        </div>

                        {project.fileUrls && project.fileUrls.length > 0 && (
                          <div className="mt-5">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
                              Attached Files ({project.fileUrls.length})
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {project.fileUrls.map((url, idx) => {
                                const filename = url.split("/").pop();
                                const fileUrl = `${import.meta.env.VITE_API_URL || ""}${url}`;
                                return (
                                  <a
                                    key={idx}
                                    href={fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-[#100c22] border border-gray-200 dark:border-white/10 ${textPrimary} hover:text-brandOrange hover:border-brandOrange/30 transition-all text-xs font-medium`}
                                  >
                                    <IconDownload
                                      size={14}
                                      className="shrink-0"
                                    />
                                    <span
                                      className="truncate max-w-[150px] sm:max-w-[200px]"
                                      title={filename}
                                    >
                                      {filename}
                                    </span>
                                  </a>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Messages Tab */}
          {activeTab === "messages" && (
            <div className="h-full">
              <ChatInterface user={user} />
            </div>
          )}

          {/* Reviews & Feedback Tab */}
          {activeTab === "reviews" && <DashboardFeedbackTab user={user} />}

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="max-w-xl space-y-6">
              <div className={`${cardBg} p-4 sm:p-6`}>
                <h2 className={`${textPrimary} font-semibold mb-6`}>
                  Company Profile
                </h2>
                <div className="space-y-4">
                  {[
                    { label: "Contact Name", value: user.fullName },
                    { label: "Email", value: user.email },
                    {
                      label: "Company Name",
                      value: user.companyName || "Not provided",
                    },
                    { label: "Website", value: user.website || "Not provided" },
                    { label: "Account Type", value: "Startup" },
                    { label: "Jobs Posted", value: String(jobs.length) },
                    {
                      label: "Total Applicants",
                      value: String(totalApplicants),
                    },
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
                      <span
                        className={`${textPrimary} text-sm break-all font-medium`}
                      >
                        {value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Edit Profile Form */}
               

                {/* Edit Profile Form */}
                <form onSubmit={handleProfileUpdate} className="mt-8 pt-8 border-t border-gray-100 dark:border-white/5 space-y-4">
                  <h3 className={`${textPrimary} font-semibold mb-4 flex items-center gap-2`}>
                    <IconBuilding size={18} className="text-brandOrange" /> Update Office Details
                  </h3>
                  
                  <div className="flex flex-col gap-1">
                    <label className={formLabel}>Office Address</label>
                    <textarea
                      name="companyAddress"
                      value={profileData.companyAddress}
                      onChange={handleProfileChange}
                      placeholder="e.g. 1600 Amphitheatre Parkway, Mountain View, CA"
                      className={`${formInput} resize-none`}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className={formLabel}>Latitude</label>
                      <input
                        type="number"
                        step="any"
                        name="lat"
                        value={profileData.lat}
                        onChange={handleProfileChange}
                        placeholder="e.g. 23.0225"
                        className={formInput}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className={formLabel}>Longitude</label>
                      <input
                        type="number"
                        step="any"
                        name="lng"
                        value={profileData.lng}
                        onChange={handleProfileChange}
                        placeholder="e.g. 72.5714"
                        className={formInput}
                      />
                    </div>
                  </div>

                  <p className="text-[10px] text-gray-500 italic">
                    Tip: You can use <a href="https://www.latlong.net/" target="_blank" rel="noreferrer" className="text-brandOrange hover:underline">latlong.net</a> to find your office coordinates.
                  </p>

                  <button
                    type="submit"
                    disabled={profileLoading}
                    className="w-full py-3 rounded-xl bg-brandOrange text-black font-bold text-sm hover:bg-[#e65a25] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {profileLoading ? (
                      <IconLoader2 size={18} className="animate-spin" />
                    ) : (
                      "Save Profile Details"
                    )}
                  </button>
                </form>

                {/* My Profile Link Button - Based on user request image */}
                <button
                  onClick={() => navigate(`/profile/${user._id || user.id}`)}
                  className="mt-8 w-full flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-white/5 hover:bg-brandOrange/10 border border-gray-100 dark:border-white/5 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#100c22] border border-gray-100 dark:border-white/5 flex items-center justify-center shadow-sm group-hover:border-[#0038A8] transition-colors">
                    <IconUser
                      className="text-gray-400 group-hover:text-[#0038A8]"
                      size={22}
                    />
                  </div>
                  <span className="text-[#0038A8] dark:text-blue-400 font-bold text-lg">
                    My Profile
                  </span>
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

export default StartupDashboard;
