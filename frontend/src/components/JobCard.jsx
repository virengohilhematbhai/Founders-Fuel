import React from 'react';
import { Zap, Bot } from 'lucide-react';

const JobCard = ({ type, title, company, tags, extraInfo }) => {
  return (
    <div className="bg-white dark:bg-cardPurple border border-teal-400/90 dark:border-teal-400/50 shadow-xl backdrop-blur-md rounded-xl p-5 w-full max-w-sm flex items-start gap-4 transition-transform hover:-translate-y-1 hover:shadow-2xl">
      {/* Icon Area */}
      <div className="flex-shrink-0 mt-1">
        {type === 'lightning' ? (
          <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800/50 flex animate-bounce items-center justify-center border border-slate-200 dark:border-slate-700">
            <Zap className="text-brandOrange w-5 h-5" fill="currentColor" />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex animate-bounce items-center justify-center border border-slate-200 dark:border-slate-700">
            <Bot className="text-pink-400 dark:text-pink-300 w-5 h-5" />
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 w-full">
        <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight mb-1">{title}</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{company}</p>

        <div className="flex flex-wrap items-center justify-between gap-y-3">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, idx) => {
              const TagElement = tag.url ? 'a' : 'span';
              return (
                <TagElement
                  key={idx}
                  href={tag.url}
                  target={tag.url ? "_blank" : undefined}
                  rel={tag.url ? "noopener noreferrer" : undefined}
                  className={`text-[10px] sm:text-xs font-semibold px-2 py-1 rounded tracking-wider ${tag.colorClass || 'bg-purple-100 dark:bg-brandPurple-light text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-brandPurple-light'} `}
                >
                  {tag.label}
                </TagElement>
              );
            })}
          </div>

          {extraInfo && (
            <p className="text-gray-400 dark:text-gray-500 text-xs font-medium shrink-0 ml-auto">{extraInfo}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobCard;
