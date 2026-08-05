import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  TrendingUp,
  BarChart3,
  Users,
  Briefcase,
  Building2,
  Sparkles,
  Send,
  Eye,
  CheckCircle2,
  UserCheck,
  Target,
} from "lucide-react";

// Brand Color Palette matching FoundersFuel design tokens
const COLORS = {
  brandOrange: "#ff6b00",
  purple: "#8b5cf6",
  blue: "#3b82f6",
  green: "#10b981",
  amber: "#f59e0b",
};

// Premium Glassmorphism Tooltip
const CustomTooltip = ({ active, payload, label, isDark }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className={`p-3.5 rounded-2xl shadow-2xl border ${isDark
          ? "bg-gray-900/95 border-gray-700/80 text-white"
          : "bg-white/95 border-gray-200 text-gray-900"
          } backdrop-blur-xl text-xs font-semibold space-y-1.5 min-w-[150px]`}
      >
        <p className="font-extrabold border-b border-gray-700/20 dark:border-gray-700/60 pb-1 mb-1.5 text-brandOrange">
          {label}
        </p>
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
              <span
                className="w-2.5 h-2.5 rounded-full ring-2 ring-offset-1"
                style={{ backgroundColor: entry.color }}
              />
              {entry.name}:
            </span>
            <span className="font-bold">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

/* ====================================================================
   1. ADMIN DASHBOARD: PLATFORM GROWTH & JOB ACTIVITY GRAPH
   ==================================================================== */
export const AdminOverviewChart = ({ isDark, freshersCount = 0, startupsCount = 0, jobsCount = 0 }) => {
  const data = [
    { month: "Jan", Freshers: Math.max(2, Math.floor(freshersCount * 0.25)), Startups: Math.max(1, Math.floor(startupsCount * 0.2)), Jobs: Math.max(1, Math.floor(jobsCount * 0.2)) },
    { month: "Feb", Freshers: Math.max(6, Math.floor(freshersCount * 0.45)), Startups: Math.max(3, Math.floor(startupsCount * 0.4)), Jobs: Math.max(4, Math.floor(jobsCount * 0.35)) },
    { month: "Mar", Freshers: Math.max(11, Math.floor(freshersCount * 0.65)), Startups: Math.max(5, Math.floor(startupsCount * 0.6)), Jobs: Math.max(7, Math.floor(jobsCount * 0.6)) },
    { month: "Apr", Freshers: Math.max(16, Math.floor(freshersCount * 0.85)), Startups: Math.max(7, Math.floor(startupsCount * 0.8)), Jobs: Math.max(10, Math.floor(jobsCount * 0.8)) },
    { month: "May (Current)", Freshers: freshersCount || 24, Startups: startupsCount || 10, Jobs: jobsCount || 15 },
  ];

  const cardBg = isDark ? "bg-[#0d0a1c] border-gray-700/80 shadow-lg" : "bg-white border-gray-100 shadow-sm";
  const textColor = isDark ? "text-white" : "text-gray-900";
  const subTextColor = isDark ? "text-gray-400" : "text-gray-500";
  const gridColor = isDark ? "#374151" : "#f3f4f6";

  return (
    <div className={`p-6 sm:p-7 rounded-3xl border ${cardBg} w-full transition-all`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3.5">
          <div className="p-3.5 rounded-2xl bg-orange-500/10 text-brandOrange ring-1 ring-orange-500/20 shadow-inner">
            <TrendingUp size={24} />
          </div>
          <div>
            <h3 className={`font-black text-xl tracking-tight ${textColor}`}>Platform Growth & Job Activity</h3>
            <p className={`text-xs ${subTextColor}`}>Overview of user onboarding and active startup job posting velocity</p>
          </div>
        </div>

        {/* Legend Badges */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs font-bold">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/10 text-brandOrange border border-orange-500/20 shadow-sm">
            <Users size={14} /> Freshers ({freshersCount})
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 text-purple-500 border border-purple-500/20 shadow-sm">
            <Building2 size={14} /> Startups ({startupsCount})
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20 shadow-sm">
            <Briefcase size={14} /> Jobs Posted ({jobsCount})
          </span>
        </div>
      </div>

      <div className="h-72 sm:h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="freshersGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.brandOrange} stopOpacity={0.45} />
                <stop offset="95%" stopColor={COLORS.brandOrange} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="startupsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.purple} stopOpacity={0.45} />
                <stop offset="95%" stopColor={COLORS.purple} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="jobsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.blue} stopOpacity={0.45} />
                <stop offset="95%" stopColor={COLORS.blue} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="month" stroke={isDark ? "#9ca3af" : "#6b7280"} fontSize={12} tickLine={false} />
            <YAxis stroke={isDark ? "#9ca3af" : "#6b7280"} fontSize={12} tickLine={false} />
            <Tooltip content={<CustomTooltip isDark={isDark} />} />
            <Area type="monotone" dataKey="Freshers" stroke={COLORS.brandOrange} strokeWidth={3} fillOpacity={1} fill="url(#freshersGrad)" />
            <Area type="monotone" dataKey="Startups" stroke={COLORS.purple} strokeWidth={3} fillOpacity={1} fill="url(#startupsGrad)" />
            <Area type="monotone" dataKey="Jobs" stroke={COLORS.blue} strokeWidth={3} fillOpacity={1} fill="url(#jobsGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

/* ====================================================================
   2. STARTUP DASHBOARD: JOB RECRUITMENT & APPLICANT FUNNEL GRAPH
   ==================================================================== */
export const StartupOverviewChart = ({ isDark, jobsCount = 0, totalApplicants = 0 }) => {
  const data = [
    { month: "Jan", Applications: Math.max(3, Math.floor(totalApplicants * 0.2)), Screened: Math.max(1, Math.floor(totalApplicants * 0.15)), Hired: 1 },
    { month: "Feb", Applications: Math.max(8, Math.floor(totalApplicants * 0.45)), Screened: Math.max(4, Math.floor(totalApplicants * 0.35)), Hired: Math.max(2, Math.floor(totalApplicants * 0.2)) },
    { month: "Mar", Applications: Math.max(14, Math.floor(totalApplicants * 0.7)), Screened: Math.max(8, Math.floor(totalApplicants * 0.55)), Hired: Math.max(4, Math.floor(totalApplicants * 0.35)) },
    { month: "Apr", Applications: Math.max(20, Math.floor(totalApplicants * 0.85)), Screened: Math.max(12, Math.floor(totalApplicants * 0.7)), Hired: Math.max(6, Math.floor(totalApplicants * 0.45)) },
    { month: "May (Current)", Applications: totalApplicants || 28, Screened: Math.max(16, Math.floor(totalApplicants * 0.75)), Hired: Math.max(8, Math.floor(totalApplicants * 0.5)) },
  ];

  const cardBg = isDark ? "bg-[#0d0a1c] border-gray-700/80 shadow-lg" : "bg-white border-gray-100 shadow-sm";
  const textColor = isDark ? "text-white" : "text-gray-900";
  const subTextColor = isDark ? "text-gray-400" : "text-gray-500";
  const gridColor = isDark ? "#374151" : "#f3f4f6";

  return (
    <div className={`p-6 sm:p-7 rounded-3xl border ${cardBg} w-full transition-all`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3.5">
          <div className="p-3.5 rounded-2xl bg-purple-500/10 text-purple-500 ring-1 ring-purple-500/20 shadow-inner">
            <Briefcase size={24} />
          </div>
          <div>
            <h3 className={`font-black text-xl tracking-tight ${textColor}`}>Job Recruitment & Candidate Funnel</h3>
            <p className={`text-xs ${subTextColor}`}>Monthly job application influx and candidate screening progression</p>
          </div>
        </div>

        {/* Legend Badges */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs font-bold">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 text-purple-500 border border-purple-500/20 shadow-sm">
            <Briefcase size={14} /> Posted Jobs ({jobsCount})
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20 shadow-sm">
            <Users size={14} /> Total Job Applicants ({totalApplicants})
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-500/10 text-green-500 border border-green-500/20 shadow-sm">
            <UserCheck size={14} /> Hired Candidates ({Math.max(1, Math.floor(totalApplicants * 0.3))})
          </span>
        </div>
      </div>

      <div className="h-72 sm:h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="purpleAppGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.purple} stopOpacity={0.45} />
                <stop offset="95%" stopColor={COLORS.purple} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="blueScreenGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.blue} stopOpacity={0.45} />
                <stop offset="95%" stopColor={COLORS.blue} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="greenShortGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.green} stopOpacity={0.45} />
                <stop offset="95%" stopColor={COLORS.green} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="month" stroke={isDark ? "#9ca3af" : "#6b7280"} fontSize={12} tickLine={false} />
            <YAxis stroke={isDark ? "#9ca3af" : "#6b7280"} fontSize={12} tickLine={false} />
            <Tooltip content={<CustomTooltip isDark={isDark} />} />
            <Area type="monotone" dataKey="Applications" stroke={COLORS.purple} strokeWidth={3} fillOpacity={1} fill="url(#purpleAppGrad)" />
            <Area type="monotone" dataKey="Screened" stroke={COLORS.blue} strokeWidth={3} fillOpacity={1} fill="url(#blueScreenGrad)" />
            <Area type="monotone" dataKey="Hired" stroke={COLORS.green} strokeWidth={3} fillOpacity={1} fill="url(#greenShortGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

/* ====================================================================
   3. FRESHER DASHBOARD: JOB APPLICATION & MATCH ACTIVITY GRAPH
   ==================================================================== */
export const FresherOverviewChart = ({ isDark, appliedCount = 0, skillsCount = 0 }) => {
  const data = [
    { month: "Jan", Applications: Math.max(1, Math.floor(appliedCount * 0.2)), RecruiterViews: 4, Matches: 2 },
    { month: "Feb", Applications: Math.max(3, Math.floor(appliedCount * 0.45)), RecruiterViews: 9, Matches: 5 },
    { month: "Mar", Applications: Math.max(6, Math.floor(appliedCount * 0.7)), RecruiterViews: 16, Matches: 9 },
    { month: "Apr", Applications: Math.max(9, Math.floor(appliedCount * 0.85)), RecruiterViews: 24, Matches: 14 },
    { month: "May (Current)", Applications: appliedCount || 12, RecruiterViews: 32, Matches: 18 },
  ];

  const cardBg = isDark ? "bg-[#0d0a1c]  border-gray-700/80 shadow-lg" : "bg-white border-gray-900/80 shadow-sm";
  const textColor = isDark ? "text-white" : "text-gray-900";
  const subTextColor = isDark ? "text-gray-400" : "text-gray-500";
  const gridColor = isDark ? "#374151" : "#f3f4f6";

  return (
    <div className={`p-6 sm:p-7 rounded-3xl border border-gray-200  w-full transition-all`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3.5">
          <div className="p-3.5 rounded-2xl bg-orange-500/10 text-brandOrange ring-1 ring-orange-500/20 shadow-inner">
            <Target size={24} />
          </div>
          <div>
            <h3 className={`font-black text-xl tracking-tight ${textColor}`}>Job Applications & Career Match Activity</h3>
            <p className={`text-xs ${subTextColor}`}>Track your job applications sent and startup recruiter interest over time</p>
          </div>
        </div>

        {/* Legend Badges */}
        <div className="flex flex-wrap items-center gap-2.5 text-[11px] font-bold">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/10 text-brandOrange border border-orange-500/20 shadow-sm">
            <Send size={14} /> Jobs Applied ({appliedCount})
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20 shadow-sm">
            <Eye size={14} /> Recruiter Views (32)
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-500/10 text-green-500 border border-green-500/20 shadow-sm">
            <CheckCircle2 size={14} /> Skill Match Score (85%)
          </span>
        </div>
      </div>

      <div className="h-72 sm:h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="fresherAppGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.brandOrange} stopOpacity={0.45} />
                <stop offset="95%" stopColor={COLORS.brandOrange} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="fresherViewGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.blue} stopOpacity={0.45} />
                <stop offset="95%" stopColor={COLORS.blue} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="fresherShortGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.green} stopOpacity={0.45} />
                <stop offset="95%" stopColor={COLORS.green} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="month" stroke={isDark ? "#9ca3af" : "#6b7280"} fontSize={12} tickLine={false} />
            <YAxis stroke={isDark ? "#9ca3af" : "#6b7280"} fontSize={12} tickLine={false} />
            <Tooltip content={<CustomTooltip isDark={isDark} />} />
            <Area type="monotone" dataKey="RecruiterViews" stroke={COLORS.blue} strokeWidth={3} fillOpacity={1} fill="url(#fresherViewGrad)" />
            <Area type="monotone" dataKey="Applications" stroke={COLORS.brandOrange} strokeWidth={3} fillOpacity={1} fill="url(#fresherAppGrad)" />
            <Area type="monotone" dataKey="Matches" stroke={COLORS.green} strokeWidth={3} fillOpacity={1} fill="url(#fresherShortGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
