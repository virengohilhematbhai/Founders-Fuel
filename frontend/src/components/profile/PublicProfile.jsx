import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  IconUser, 
  IconBuilding, 
  IconStar, 
  IconArrowLeft, 
  IconMapPin, 
  IconMail, 
  IconLink,
   IconMessage2,
  IconLoader2,
  IconBriefcase,
  IconCheck,
  IconCertificate
} from "@tabler/icons-react";
import ReviewList from "./ReviewList";

const PublicProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfileData();
  }, [userId]);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      // Fetch User Info
      const userRes = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/users/${userId}`);
      const userData = await userRes.json();
      
      // Fetch Feedback
      const feedbackRes = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/feedback/${userId}`);
      const feedbackData = await feedbackRes.json();

      if (userRes.ok) {
        setUser(userData.user);
      }
      if (feedbackRes.ok) {
        setReviews(feedbackData.feedbacks || []);
      }
    } catch (err) {
      console.error("Failed to fetch profile data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-background">
        <IconLoader2 className="animate-spin text-brandOrange" size={48} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-background p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">User Not Found</h2>
        <button 
          onClick={() => navigate(-1)}
          className="px-6 py-2 rounded-xl bg-brandOrange text-black font-bold"
        >
          Go Back
        </button>
      </div>
    );
  }

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "No ratings";

  const isStartup = user.userType === "startup";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background pb-20 pt-24 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-6">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-brandOrange transition-colors mb-8 font-medium group"
        >
          <IconArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to Dashboard
        </button>

        {/* Profile Header Card */}
        <div className="relative mb-12">
          {/* Decorative Background */}
          <div className="h-40 w-full rounded-3xl bg-gradient-to-r from-brandOrange/20 to-purple-600/20 blur-xl absolute -z-10 opacity-50"></div>
          
          <div className="bg-white dark:bg-[#0d0a1c] rounded-3xl border border-gray-100 dark:border-white/5 p-8 shadow-2xl shadow-black/5 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 relative overflow-hidden">
             {/* Icon Background Glow */}
             <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-64 h-64 bg-brandOrange/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-24 h-24 rounded-3xl  bg-gray-100 dark:bg-white/5 flex items-center justify-center text-brandOrange border-2 border-white dark:border-white/5 shadow-lg">
                {isStartup ? <IconBuilding size={48} /> : <IconUser size={48} />}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                    {user.fullName}
                  </h1>
                  {reviews.length > 5 && (
                    <div className="bg-blue-500/10 text-blue-500 p-1 rounded-full border border-blue-500/20" title="Trusted Community Member">
                      <IconCheck size={20} />
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                   <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 dark:bg-white/5">
                    <span className="w-2 h-2 rounded-full bg-brandOrange"></span>
                    <span className="uppercase tracking-widest text-[10px] font-bold">{user.userType}</span>
                  </div>
                  {user.companyAddress && (
                    <div className="flex items-center gap-1.5">
                      <IconMapPin size={16} className="text-brandOrange" />
                      {user.companyAddress}
                    </div>
                  )}
                  {isStartup && user.companyName && (
                    <div className="flex items-center gap-1.5">
                      <IconBriefcase size={16} className="text-brandOrange" />
                      {user.companyName}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center md:items-end gap-2 text-right">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Reputation Score</p>
              <div className="flex items-center gap-3">
                 <div className="flex flex-col items-end">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <IconStar 
                        key={i} 
                        size={18} 
                        className={i < Math.round(parseFloat(averageRating) || 0) ? "text-brandOrange fill-brandOrange" : "text-gray-200 dark:text-gray-800"} 
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1 font-bold">{reviews.length} Verified Reviews</p>
                </div>
                <div className="text-5xl font-black text-gray-900 dark:text-white leading-none">
                  {averageRating}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#0d0a1c] rounded-3xl border border-gray-100 dark:border-white/5 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-50 dark:border-white/5 pb-4">Professional Overview</h3>
              
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-brandOrange font-bold mb-2">Technical Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {user.skills ? (
                      user.skills.split(",").map((skill, index) => (
                        <span 
                          key={index} 
                          className="px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-gray-700 dark:text-gray-300 text-xs font-medium"
                        >
                          {skill.trim()}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-gray-400 italic">No skills listed</p>
                    )}
                  </div>
                </div>

                {user.experience && (
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-brandOrange font-bold mb-2">Work History</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{user.experience}</p>
                  </div>
                )}

                <div className="pt-4 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-500 hover:text-brandOrange transition-colors cursor-pointer group">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-white/5 flex items-center justify-center group-hover:bg-brandOrange/10">
                      <IconMail size={16} />
                    </div>
                    {user.email}
                  </div>
                  {user.website && (
                    <div className="flex items-center gap-3 text-sm text-gray-500 hover:text-brandOrange transition-colors cursor-pointer group">
                       <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-white/5 flex items-center justify-center group-hover:bg-brandOrange/10">
                        <IconLink size={16} />
                      </div>
                      {user.website}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* <div className="p-6 rounded-3xl bg-gradient-to-br from-brandOrange to-purple-600">
               <div className="flex items-center gap-3 mb-4">
                  <IconCertificate className="text-white" size={24} />
                  <h4 className="text-white font-bold">Trusted Collaboration</h4>
               </div>
               <p className="text-white/80 text-sm leading-relaxed mb-4">
                  Every review shown here is from a verified interaction on FoundersFuel. We ensure that our professionals maintain the highest standards.
               </p>
               <button 
                onClick={() => navigate("/dashboard")}
                className="w-full py-3 bg-white text-black font-bold rounded-xl text-sm hover:bg-gray-100 transition-colors shadow-lg"
               >
                 Submit Your Review
               </button>
            </div> */}
          </div>

          {/* Main Content Area: Reviews */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <IconMessage2 className="text-brandOrange" size={24} />
                Community Feedback
              </h3>
              <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-gray-400">
                <span>Recent First</span>
                <div className="w-[1px] h-4 bg-gray-200 dark:border-white/5"></div>
                <span className="text-brandOrange">{reviews.length} total</span>
              </div>
            </div>

            <div className="bg-white dark:bg-[#0d0a1c] rounded-3xl border border-gray-100 dark:border-white/5 p-2 shadow-sm">
              <ReviewList reviews={reviews} loading={false} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
