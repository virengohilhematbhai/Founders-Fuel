import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import About from "./components/About";
import Contact from "./components/Contact";
import Login from "./components/Login";
import Registration from "./components/Registration";
import Footer from "./components/Footer";
import FresherDashboard from "./components/dashboards/FresherDashboard";
import StartupDashboard from "./components/dashboards/StartupDashboard";
import AdminDashboard from "./components/dashboards/AdminDashboard";
import DashboardFeedbackTab from "./components/profile/DashboardFeedbackTab";
import PublicProfile from "./components/profile/PublicProfile";
import TermsAndConditions from "./components/pages/TermsAndConditions";
import PrivacyPolicy from "./components/pages/PrivacyPolicy";
import AccountDeleted from "./components/profile/AccountDeleted";

// Helper to get the correct dashboard path for a user
const getDashboardPath = (userData) => {
  if (userData?.userType === "admin") return "/dashboard/admin";
  if (userData?.userType === "startup") return "/dashboard/startup";
  return "/dashboard/fresher";
};

// Protected route wrapper — redirects to /login if not authenticated
const ProtectedRoute = ({ user, children }) => {
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  const [user, setUser] = useState(null);
  const [authLoaded, setAuthLoaded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // On mount, restore user from localStorage and validate token against server
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      // Validate token with the backend before trusting it
      fetch(`${import.meta.env.VITE_API_URL || ""}/api/auth/me`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
        .then((res) => {
          if (res.ok) {
            setUser(JSON.parse(storedUser));
          } else {
            // Token is expired or invalid — clear it
            localStorage.removeItem("token");
            localStorage.removeItem("user");
          }
        })
        .catch(() => {
          // Network error: trust the stored user so the app still works offline-ish
          setUser(JSON.parse(storedUser));
        })
        .finally(() => {
          setAuthLoaded(true);
        });
    } else {
      setAuthLoaded(true);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    // Redirect to the correct dashboard based on userType
    navigate(getDashboardPath(userData));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  // Hide Navbar/Footer on dashboard pages for a cleaner layout
  const isDashboard = location.pathname.startsWith("/dashboard");

  // Don't render routes until we've checked localStorage for auth
  if (!authLoaded) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-background relative overflow-hidden flex flex-col font-sans transition-colors duration-300">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-900/5 dark:bg-purple-900/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-brandOrange/5 rounded-full blur-[150px] pointer-events-none"></div>

      {!isDashboard && (
        <Navbar
          user={user}
          onLogout={handleLogout}
        />
      )}
      <main className={`flex-1${!isDashboard ? " pt-[64px]" : ""}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/login"
            element={
              user ? <Navigate to={getDashboardPath(user)} replace /> : <Login onLogin={handleLogin} />
            }
          />
          <Route
            path="/register"
            element={
              user ? <Navigate to={getDashboardPath(user)} replace /> : <Registration onLogin={handleLogin} />
            }
          />
          <Route
            path="/dashboard/fresher"
            element={
              <ProtectedRoute user={user}>
                <FresherDashboard user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/startup"
            element={
              <ProtectedRoute user={user}>
                <StartupDashboard user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute user={user}>
                <AdminDashboard user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/:userId"
            element={
              <ProtectedRoute user={user}>
                <PublicProfile />
              </ProtectedRoute>
            }
          />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/account-deleted" element={<AccountDeleted />} />
          {/* Catch-all — redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isDashboard && <Footer />}
    </div>
  );
}

export default App;