import React, { useState, useEffect } from "react";
import { 
  IconStar, 
  IconMessage2, 
  IconCheck, 
  IconBuilding, 
  IconUser,
  IconSend,
  IconLoader2,
  IconArrowLeft,
  IconHistory,
  IconPencil
} from "@tabler/icons-react";
import ReviewList from "./ReviewList";

const DashboardFeedbackTab = ({ user }) => {
  const [activeSubTab, setActiveSubTab] = useState("received"); // "received", "given", "new"
  const [receivedReviews, setReceivedReviews] = useState([]);
  const [givenReviews, setGivenReviews] = useState([]);
  const [collaborators, setCollaborators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReviewee, setSelectedReviewee] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  
  // Form State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [criteria, setCriteria] = useState({});

  useEffect(() => {
    fetchData();
  }, [activeSubTab]);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const userId = user._id || user.id;

    try {
      if (activeSubTab === "received") {
        const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/feedback/${userId}`);
        const data = await res.json();
        setReceivedReviews(data.feedbacks || []);
      } else if (activeSubTab === "given") {
        const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/feedback/given/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setGivenReviews(data.feedbacks || []);
      } else if (activeSubTab === "new") {
        // Fetch collaborators
        if (user.userType === "fresher") {
          const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/jobs`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          const jobs = data.jobs || [];
          const startups = [];
          const seen = new Set();
          jobs.forEach(job => {
            if (job.postedBy && !seen.has(job.postedBy._id)) {
              startups.push({ _id: job.postedBy._id, name: job.postedBy.companyName || job.postedBy.fullName, type: "startup" });
              seen.add(job.postedBy._id);
            }
          });
          setCollaborators(startups);
        } else {
          const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/jobs/startup/my-jobs`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          const jobs = data.jobs || [];
          const freshers = [];
          const seen = new Set();
          jobs.forEach(job => {
            job.applicants?.forEach(app => {
              if (!seen.has(app._id)) {
                freshers.push({ _id: app._id, name: app.fullName, type: "fresher" });
                seen.add(app._id);
              }
            });
          });
          setCollaborators(freshers);
        }
      }
    } catch (err) {
      console.error("Data fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRatingChange = (cat, val) => {
    setCriteria(prev => ({ ...prev, [cat]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedReviewee) return;
    
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ revieweeId: selectedReviewee._id, rating, comment, criteria })
      });
      
      if (res.ok) {
        setFeedbackSuccess(true);
        setTimeout(() => {
          setFeedbackSuccess(false);
          setSelectedReviewee(null);
          setComment("");
          setRating(5);
          setCriteria({});
          setActiveSubTab("given");
        }, 2000);
      }
    } catch (err) {
      console.error("Feedback submission error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const startupCriteria = [
    { key: "workExperience", label: "Work Experience" },
    { key: "environment", label: "Environment" },
    { key: "support", label: "Support" }
  ];

  const fresherCriteria = [
    { key: "performance", label: "Performance" },
    { key: "skills", label: "Skills" },
    { key: "professionalism", label: "Professionalism" }
  ];

  const activeCriteria = user.userType === "fresher" ? startupCriteria : fresherCriteria;

  const averageRating = receivedReviews.length > 0 
    ? (receivedReviews.reduce((sum, r) => sum + r.rating, 0) / receivedReviews.length).toFixed(1)
    : "N/A";

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Summary */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-[#0d0a1c] border border-gray-100 dark:border-white/5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-brandOrange/10 flex items-center justify-center text-brandOrange border border-brandOrange/20 shadow-inner">
            <IconStar size={32} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Professional Reputation</h2>
            <p className="text-sm text-gray-500">Managing your platform trust and feedback</p>
          </div>
        </div>
        <div className="flex items-center gap-6 pr-4">
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Average Score</p>
            <p className="text-3xl font-black text-brandOrange">{averageRating}</p>
          </div>
          <div className="w-[1px] h-10 bg-gray-100 dark:bg-white/5"></div>
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Total Reviews</p>
            <p className="text-3xl font-black text-gray-900 dark:text-white">{receivedReviews.length}</p>
          </div>
        </div>
      </div>

      {/* Sub Navigation */}
      <div className="flex p-1 gap-1 bg-gray-100 dark:bg-white/5 rounded-2xl w-full max-w-md">
        {["received", "given", "new"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              activeSubTab === tab 
                ? "bg-white dark:bg-brandOrange text-gray-900 dark:text-black shadow-sm" 
                : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            {tab === "received" && <IconStar size={16} />}
            {tab === "given" && <IconHistory size={16} />}
            {tab === "new" && <IconPencil size={16} />}
            {tab}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="min-h-[400px]">
        {activeSubTab === "received" && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 ml-1">Reviews Received</h3>
            <ReviewList reviews={receivedReviews} loading={loading} />
          </div>
        )}

        {activeSubTab === "given" && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 ml-1">Reviews You've Shared</h3>
            <ReviewList reviews={givenReviews} loading={loading} />
          </div>
        )}

        {activeSubTab === "new" && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 ml-1 mb-4">
              {selectedReviewee ? "Complete Your Review" : "Select a Collaborator to Review"}
            </h3>

            {!selectedReviewee ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {collaborators.length > 0 ? (
                  collaborators.map((collab) => (
                    <button
                      key={collab._id}
                      onClick={() => setSelectedReviewee(collab)}
                      className="flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-[#0d0a1c] border border-gray-100 dark:border-white/5 hover:border-brandOrange/30 hover:shadow-xl hover:shadow-brandOrange/5 transition-all text-left group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-white/10 flex items-center justify-center group-hover:bg-brandOrange/10 transition-colors">
                        {user.userType === "fresher" ? <IconBuilding size={20} className="text-gray-400 group-hover:text-brandOrange transition-colors" /> : <IconUser size={20} className="text-gray-400 group-hover:text-brandOrange transition-colors" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 dark:text-white font-bold truncate">{collab.name}</p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">{collab.type}</p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="col-span-full p-12 rounded-3xl border border-dashed border-gray-200 dark:border-white/10 text-center">
                    <p className="text-gray-500">No recent collaborations found to review.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white dark:bg-[#0d0a1c] rounded-3xl border border-gray-100 dark:border-white/5 p-8 shadow-xl">
                {feedbackSuccess ? (
                  <div className="py-12 text-center animate-in zoom-in duration-300">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/20">
                      <IconCheck className="text-white" size={32} />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white">Submission Successful!</h4>
                    <p className="text-sm text-gray-500 mt-2">Thank you for contributing to the community.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex items-center justify-between mb-2">
                       <button 
                        type="button"
                        onClick={() => setSelectedReviewee(null)}
                        className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-brandOrange transition-colors"
                      >
                        <IconArrowLeft size={14} /> Back to List
                      </button>
                      <span className="text-xs font-bold text-gray-500 uppercase">Reviewing {selectedReviewee.name}</span>
                    </div>

                    {/* Overall Score */}
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Overall Satisfaction</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setRating(num)}
                            className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${
                              rating >= num 
                                ? "bg-brandOrange border-brandOrange text-black" 
                                : "border-gray-100 dark:border-white/10 text-gray-400"
                            }`}
                          >
                            <IconStar size={20} className={rating >= num ? "fill-black" : ""} />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Criteria */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      {activeCriteria.map((crit) => (
                        <div key={crit.key}>
                          <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{crit.label}</label>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((num) => (
                              <button
                                key={num}
                                type="button"
                                onClick={() => handleRatingChange(crit.key, num)}
                                className={`w-7 h-7 rounded border flex items-center justify-center transition-all ${
                                  (criteria[crit.key] || 0) >= num 
                                    ? "bg-purple-500 border-purple-500 text-white shadow-sm" 
                                    : "border-gray-50 dark:border-white/5 text-gray-300 dark:text-gray-700 hover:border-purple-300"
                                }`}
                              >
                                <IconStar size={17} className={(criteria[crit.key] || 0) >= num ? "fill-white" : ""} />
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Comment */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Your Private Comment</label>
                      <textarea
                        required
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Tell others about your experience..."
                        className="w-full rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 p-4 text-sm text-gray-900 dark:text-white outline-none focus:border-brandOrange min-h-[120px] resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3.5 rounded-2xl bg-brandOrange text-black font-bold hover:bg-[#e65a25] transition-all flex items-center justify-center gap-2 shadow-lg shadow-brandOrange/20 disabled:opacity-50"
                    >
                      {submitting ? <IconLoader2 className="animate-spin" size={20} /> : <IconSend size={20} />}
                      Post Professional Feedback
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardFeedbackTab;
