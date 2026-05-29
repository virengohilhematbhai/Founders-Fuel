import React from "react";
import { useNavigate } from "react-router-dom";
import { IconTrashOff, IconHome, IconUserPlus, IconHeart } from "@tabler/icons-react";

const AccountDeleted = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-white dark:bg-background flex items-center justify-center py-20 px-6 overflow-hidden transition-colors duration-300">
      {/* Background Decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/5 dark:bg-purple-900/10 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-brandOrange/5 rounded-full blur-[150px] pointer-events-none animate-pulse"></div>

      <div className="max-w-2xl w-full relative z-10 text-center">
        {/* Success Icon */}
        <div className="mb-8 relative inline-block">
          <div className="w-24 h-24 rounded-[32px] bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto animate-bounce shadow-2xl shadow-red-500/10">
            <IconTrashOff className="text-red-500" size={48} />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-brandOrange flex items-center justify-center border-4 border-white dark:border-background shadow-lg">
            <IconHeart className="text-white fill-current" size={14} />
          </div>
        </div>

        {/* Header */}
        <h1 className="text-4xl md:text-5xl font-black mb-6 text-gray-900 dark:text-white leading-tight">
          Account <span className="text-red-500">Deleted</span> Successfully
        </h1>

        {/* Message Card */}
        <div className="p-8 md:p-10 rounded-[40px] border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-[#0f0b1a]/50 backdrop-blur-xl shadow-2xl mb-10 text-left relative group hover:border-brandOrange/30 transition-all duration-500">
          <div className="space-y-6">
            <p className="text-gray-600 dark:text-gray-300 text-lg md:text-xl leading-relaxed font-medium">
              Your account has been successfully deleted, and all your data has been permanently removed from our system.
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg leading-relaxed">
              This action <span className="text-red-500 font-bold uppercase tracking-wider">cannot be undone</span>, and you will no longer be able to access your account or any associated information.
            </p>
            <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 dark:via-white/10 to-transparent my-6"></div>
            <p className="text-gray-600 dark:text-gray-300 text-lg italic leading-relaxed">
              "We’re sorry to see you go, and we appreciate the time you spent with us. If you ever wish to return, you are always welcome to create a new account and start again."
            </p>
          </div>
          
          {/* Subtle decoration inside the card */}
          <div className="absolute bottom-4 right-8 opacity-10 dark:opacity-5 pointer-events-none">
             <IconTrashOff size={100} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl"
          >
            <IconHome size={22} />
            Return to Home
          </button>
          <button
            onClick={() => navigate("/register")}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-brandOrange text-black font-bold text-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl shadow-brandOrange/20"
          >
            <IconUserPlus size={22} />
            Create New Account
          </button>
        </div>

        {/* Farewell Text */}
        <p className="mt-12 text-gray-400 dark:text-gray-500 text-sm font-medium tracking-wide uppercase">
          Thank you for being part of FoundersFuel
        </p>
      </div>
    </div>
  );
};

export default AccountDeleted;
