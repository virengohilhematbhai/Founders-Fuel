// import React, { useState, useEffect } from "react";
// import {
//   IconStar,
//   IconMessage2,
//   IconArrowLeft,
//   IconCheck,
//   IconBuilding,
//   IconUser,
//   IconSend,
//   IconLoader2,
// } from "@tabler/icons-react";
// import { useNavigate } from "react-router-dom";

// const FeedbackPage = ({ user }) => {
//   const navigate = useNavigate();
//   const [collaborators, setCollaborators] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [submitting, setSubmitting] = useState(false);
//   const [feedbackSuccess, setFeedbackSuccess] = useState(false);

//   // Form State
//   const [rating, setRating] = useState(5);
//   const [comment, setComment] = useState("");
//   const [criteria, setCriteria] = useState({});

//   useEffect(() => {
//     fetchCollaborators();
//   }, []);

//   const fetchCollaborators = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (user.userType === "fresher") {
//         // Fetch startups the fresher applied to
//         const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/jobs`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const data = await res.json();
//         const jobs = data.jobs || [];

//         // Extract unique startups
//         const startups = [];
//         const seen = new Set();
//         jobs.forEach((job) => {
//           if (job.postedBy && !seen.has(job.postedBy._id)) {
//             startups.push({
//               _id: job.postedBy._id,
//               name: job.postedBy.companyName || job.postedBy.fullName,
//               type: "startup",
//             });
//             seen.add(job.postedBy._id);
//           }
//         });
//         setCollaborators(startups);
//       } else {
//         // Fetch freshers who applied to the startup's jobs
//         const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/jobs/my-jobs`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const data = await res.json();
//         const jobs = data.jobs || [];

//         const freshers = [];
//         const seen = new Set();
//         jobs.forEach((job) => {
//           job.applicants.forEach((app) => {
//             if (!seen.has(app._id)) {
//               freshers.push({
//                 _id: app._id,
//                 name: app.fullName,
//                 type: "fresher",
//               });
//               seen.add(app._id);
//             }
//           });
//         });
//         setCollaborators(freshers);
//       }
//     } catch (err) {
//       console.error("Failed to fetch collaborators:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRatingChange = (cat, val) => {
//     setCriteria((prev) => ({ ...prev, [cat]: val }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!selectedUser) return;

//     setSubmitting(true);
//     try {
//       const token = localStorage.getItem("token");
//       const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/feedback`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           revieweeId: selectedUser._id,
//           rating,
//           comment,
//           criteria,
//         }),
//       });

//       if (res.ok) {
//         setFeedbackSuccess(true);
//         setTimeout(() => {
//           setFeedbackSuccess(false);
//           setSelectedUser(null);
//           setComment("");
//           setRating(5);
//           setCriteria({});
//         }, 3000);
//       }
//     } catch (err) {
//       console.error("Feedback submission error:", err);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const startupCriteria = [
//     { key: "workExperience", label: "Work Experience" },
//     { key: "communication", label: "Communication" },
//     { key: "support", label: "Support" },
//     { key: "overallSatisfaction", label: "Overall Satisfaction" },
//   ];

//   const fresherCriteria = [
//     { key: "performance", label: "Performance" },
//     { key: "skills", label: "Skills" },
//     { key: "punctuality", label: "Punctuality" },
//     { key: "professionalism", label: "Professionalism" },
//   ];

//   const activeCriteria =
//     user.userType === "fresher" ? startupCriteria : fresherCriteria;

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-background">
//         <IconLoader2 className="animate-spin text-brandOrange" size={40} />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-background pb-20 pt-10">
//       <div className="max-w-4xl mx-auto px-6">
//         <button
//           onClick={() => navigate(-1)}
//           className="flex items-center gap-2 text-gray-500 hover:text-brandOrange transition-colors mb-6 font-medium"
//         >
//           <IconArrowLeft size={18} /> Back
//         </button>

//         <div className="mb-10">
//           <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
//             Platform <span className="text-brandOrange">Feedback</span>
//           </h1>
//           <p className="text-gray-500 dark:text-gray-400">
//             Share your experience to help build a more reliable and trusted
//             community.
//           </p>
//         </div>

//         {!selectedUser ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="md:col-span-2 mb-2">
//               <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">
//                 Select Someone to Review
//               </h2>
//             </div>
//             {collaborators.length > 0 ? (
//               collaborators.map((collab) => (
//                 <button
//                   key={collab._id}
//                   onClick={() => setSelectedUser(collab)}
//                   className="flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-[#100c22] border border-gray-100 dark:border-white/5 hover:border-brandOrange/30 hover:shadow-xl hover:shadow-brandOrange/5 transition-all text-left group"
//                 >
//                   <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center group-hover:bg-brandOrange/10 transition-colors">
//                     {user.userType === "fresher" ? (
//                       <IconBuilding className="text-gray-400 group-hover:text-brandOrange" />
//                     ) : (
//                       <IconUser className="text-gray-400 group-hover:text-brandOrange" />
//                     )}
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <p className="text-gray-900 dark:text-white font-bold truncate">
//                       {collab.name}
//                     </p>
//                     <p className="text-xs text-gray-400 uppercase tracking-wider mt-0.5">
//                       {collab.type}
//                     </p>
//                   </div>
//                   <IconMessage2
//                     size={20}
//                     className="text-gray-300 group-hover:text-brandOrange"
//                   />
//                 </button>
//               ))
//             ) : (
//               <div className="md:col-span-2 p-12 rounded-3xl bg-white dark:bg-[#100c22] border border-dashed border-gray-200 dark:border-white/10 text-center">
//                 <p className="text-gray-500">
//                   No collaborators found to review yet.
//                 </p>
//               </div>
//             )}
//           </div>
//         ) : (
//           <div className="bg-white dark:bg-[#100c22] rounded-3xl border border-gray-100 dark:border-white/5 p-8 shadow-2xl shadow-black/5 animate-in fade-in slide-in-from-bottom-4 duration-500">
//             <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-50 dark:border-white/5">
//               <div className="flex items-center gap-4">
//                 <div className="w-14 h-14 rounded-2xl bg-brandOrange/10 flex items-center justify-center text-brandOrange">
//                   <IconMessage2 size={28} />
//                 </div>
//                 <div>
//                   <h2 className="text-xl font-bold text-gray-900 dark:text-white">
//                     Reviewing {selectedUser.name}
//                   </h2>
//                   <p className="text-sm text-gray-500">
//                     Sharing your professional experience
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setSelectedUser(null)}
//                 className="text-sm text-gray-400 hover:text-red-500 transition-colors"
//               >
//                 Cancel
//               </button>
//             </div>

//             {feedbackSuccess ? (
//               <div className="py-20 text-center animate-in zoom-in duration-300">
//                 <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/20">
//                   <IconCheck className="text-white" size={40} />
//                 </div>
//                 <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
//                   Thank You!
//                 </h3>
//                 <p className="text-gray-500">
//                   Your feedback has been submitted successfully.
//                 </p>
//               </div>
//             ) : (
//               <form onSubmit={handleSubmit} className="space-y-8">
//                 {/* Overall Rating */}
//                 <div>
//                   <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
//                     Overall Experience
//                   </label>
//                   <div className="flex gap-2">
//                     {[1, 2, 3, 4, 5].map((num) => (
//                       <button
//                         key={num}
//                         type="button"
//                         onClick={() => setRating(num)}
//                         className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all ${
//                           rating >= num
//                             ? "bg-brandOrange border-brandOrange text-black shadow-lg shadow-brandOrange/20"
//                             : "border-gray-200 dark:border-white/10 text-gray-400 hover:border-brandOrange/30"
//                         }`}
//                       >
//                         <IconStar
//                           size={24}
//                           className={rating >= num ? "fill-black" : ""}
//                         />
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Specific Criteria */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
//                   {activeCriteria.map((crit) => (
//                     <div key={crit.key}>
//                       <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
//                         {crit.label}
//                       </label>
//                       <div className="flex gap-1.5">
//                         {[1, 2, 3, 4, 5].map((num) => (
//                           <button
//                             key={num}
//                             type="button"
//                             onClick={() => handleRatingChange(crit.key, num)}
//                             className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all ${
//                               (criteria[crit.key] || 0) >= num
//                                 ? "bg-purple-500 border-purple-500 text-white shadow-md shadow-purple-500/20"
//                                 : "border-gray-100 dark:border-white/5 text-gray-300 dark:text-gray-600 hover:border-purple-300"
//                             }`}
//                           >
//                             <IconStar
//                               size={14}
//                               className={
//                                 (criteria[crit.key] || 0) >= num
//                                   ? "fill-white"
//                                   : ""
//                               }
//                             />
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Comment */}
//                 <div>
//                   <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
//                     Detailed Comment
//                   </label>
//                   <textarea
//                     required
//                     value={comment}
//                     onChange={(e) => setComment(e.target.value)}
//                     placeholder="Write about what went well and what could be improved..."
//                     className="w-full rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 p-5 text-gray-900 dark:text-white outline-none focus:border-brandOrange min-h-[150px] transition-all resize-none"
//                   />
//                 </div>

//                 <button
//                   type="submit"
//                   disabled={submitting}
//                   className="w-full py-4 rounded-2xl bg-brandOrange text-black font-bold text-lg hover:bg-[#e65a25] transition-all flex items-center justify-center gap-2 shadow-xl shadow-brandOrange/20 disabled:opacity-50"
//                 >
//                   {submitting ? (
//                     <IconLoader2 className="animate-spin" />
//                   ) : (
//                     <IconSend size={20} />
//                   )}
//                   Submit Professional Review
//                 </button>
//               </form>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FeedbackPage;
