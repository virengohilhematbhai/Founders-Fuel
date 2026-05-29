import React from "react";
import { IconStar, IconQuote } from "@tabler/icons-react";

const ReviewList = ({ reviews, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brandOrange"></div>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 dark:text-gray-400">
        <p className="text-sm">No reviews yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div 
          key={review._id} 
          className="p-5 rounded-2xl bg-white dark:bg-[#100c22] border border-gray-100 dark:border-white/5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-brandOrange/10 flex items-center justify-center">
                <span className="text-brandOrange font-bold text-xs uppercase">
                  {review.reviewer?.fullName?.charAt(0) || "U"}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {review.reviewer?.fullName || "User"}
                </p>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <IconStar 
                      key={i} 
                      size={12} 
                      className={i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-700"} 
                    />
                  ))}
                </div>
              </div>
            </div>
            <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">
              {new Date(review.createdAt).toLocaleDateString()}
            </span>
          </div>
          
          <div className="relative">
            <IconQuote className="absolute -top-1 -left-1 text-brandOrange/10" size={24} />
            <p className="text-sm text-gray-600 dark:text-gray-300 pl-4 py-1 italic leading-relaxed">
              "{review.comment}"
            </p>
          </div>

          {/* Role specific criteria summary */}
          {review.criteria && (
            <div className="mt-4 flex flex-wrap gap-2 pt-3 border-t border-gray-50 dark:border-white/5">
              {Object.entries(review.criteria).map(([key, value]) => (
                value > 0 && (
                  <div key={key} className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-0.5 px-1 truncate max-w-[80px]">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </span>
                    <div className="flex gap-0.5 bg-gray-50 dark:bg-white/5 px-2 py-1 rounded-lg">
                      {[...Array(5)].map((_, i) => (
                        <IconStar 
                          key={i} 
                          size={12} 
                          className={i < value ? "text-brandOrange fill-brandOrange" : "text-gray-200 dark:text-gray-800"} 
                        />
                      ))}
                    </div>
                  </div>
                )
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
