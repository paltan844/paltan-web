{/*
// src/features/dashboard/MainTabs.web.tsx
import React from "react";
import { Link, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Home, Grid, ShoppingCart, User } from "lucide-react";

import ProductDashboard from "@features/dashboard/ProductDashboard";
import CategoryList from "@features/dashboard/CategoryList";
import Kart from "@features/profile/Kart";
import Profile from "@features/profile/Profile";
import { useAuthStore } from "@state/authStore";

const MainTabs: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const tabItems = [
    { path: "/", label: "Home", icon: <Home size={18} /> },
    { path: "/categories", label: "Categories", icon: <Grid size={18} /> },
    { path: "/kart", label: "Kart", icon: <ShoppingCart size={18} /> },
    { path: "/profile", label: "Profile", icon: <User size={18} /> },
  ];

  // ✅ Check if we are on profile route
  const isProfileScreen = location.pathname === "/profile";

  return (
    <div className="main-tabs-container">
      {/* ✅ Main tab routes /}
      <div className="tab-content">
        <Routes>
          <Route path="/" element={<ProductDashboard />} />
          <Route path="/categories" element={<CategoryList />} />
          <Route path="/kart" element={<Kart />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

{!isProfileScreen && (
  <nav className="tab-bar">
    {tabItems.map((tab) => {
      const isKart = tab.path === "/kart";
      const { user } = useAuthStore.getState();

      return (
        <Link
          key={tab.path}
          to={isKart && !user ? location.pathname : tab.path} // stay on same page if not logged in
          onClick={(e) => {
            if (isKart && !user) {
              e.preventDefault(); // stop navigation
              window.alert("Please login first to access your Kart.");
            }
          }}
          className="tab-link"
        >
          <div className={`tab-item ${isActive(tab.path) ? "active" : ""}`}>
            {tab.icon}
            <span>{tab.label}</span>
          </div>
        </Link>
      );
    })}
  </nav>
)}



      {/* ✅ Styles /}
      <style>{`
        .main-tabs-container {
          width: 100%;
          min-height: 100vh;
          background-color: #fff;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          font-family: 'Inter', 'Poppins', 'Roboto', sans-serif;
        }
        .tab-content {
          flex: 1;
          padding-bottom: 70px;
        }
        .tab-bar {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 45px;
          background-color: rgb(4, 35, 62);
          display: flex;
          justify-content: space-around;
          align-items: center;
          border-top: 0.5px solid #ccc;
          z-index: 1000;
        }
        .tab-link {
          text-decoration: none;
        }
        .tab-item {
          color: white;
          font-size: 10px;
          font-weight: bold;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          transition: color 0.3s ease;
        }
        .tab-item.active {
          color: rgb(239, 217, 18);
        }
        .tab-item:hover {
          color: rgb(239, 217, 18);
        }
      `}</style>
    </div>
  );
};

export default MainTabs;
*/}


import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Home, Grid, ShoppingCart, User } from "lucide-react";

import ProductDashboard from "@features/dashboard/ProductDashboard";
import CategoryList from "@features/dashboard/CategoryList";
import Kart from "@features/profile/Kart";
import Profile from "@features/profile/Profile";
import { useAuthStore } from "@state/authStore";

const MainTabs: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [activeTab, setActiveTab] = useState(location.pathname);
  const [prevTab, setPrevTab] = useState(location.pathname);
  const [clickedTab, setClickedTab] = useState<string | null>(null);

  useEffect(() => {
    setActiveTab(location.pathname);
    setPrevTab(location.pathname);
  }, [location.pathname]);

  const tabItems = [
    { path: "/", label: "Home", icon: <Home size={18} /> },
    { path: "/categories", label: "Categories", icon: <Grid size={18} /> },
    { path: "/kart", label: "Kart", icon: <ShoppingCart size={18} /> },
    { path: "/profile", label: "Profile", icon: <User size={18} /> },
  ];

  const isProfileScreen = location.pathname === "/profile";

  const handleTabClick = (tabPath: string) => {
    const isKart = tabPath === "/kart";

    // ⭐ Bounce Animation
    setClickedTab(tabPath);
    setTimeout(() => setClickedTab(null), 200);

    if (isKart && !user) {
      window.alert("Please login first to access your Kart.");
      setActiveTab(prevTab);
      return;
    }

    setActiveTab(tabPath);
    setPrevTab(tabPath);
    navigate(tabPath);
  };

  return (
    <div className="main-tabs-container">
      <div className="tab-content">
        <Routes>
          <Route path="/" element={<ProductDashboard />} />
          <Route path="/categories" element={<CategoryList />} />
          <Route path="/kart" element={<Kart />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {!isProfileScreen && (
        <nav className="tab-bar" role="navigation" aria-label="Main tabs">
          {tabItems.map((tab) => {
            const isKart = tab.path === "/kart";
            const isActive = activeTab === tab.path && !(isKart && !user);

            return (
              <button
                key={tab.path}
                type="button"
                className={`tab-btn ${isActive ? "active" : ""}`}
                onClick={() => handleTabClick(tab.path)}
                aria-current={isActive ? "page" : undefined}
              >
                <div
                  className={`tab-item 
                  ${isActive ? "active" : ""} 
                  ${clickedTab === tab.path ? "clicked" : ""}
                `}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </div>
              </button>
            );
          })}
        </nav>
      )}

      <style>{`
        .main-tabs-container {
          width: 100%;
          min-height: 100vh;
          background-color: #fff;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          font-family: 'Inter', 'Poppins', 'Roboto', sans-serif;
        }
        .tab-content {
          flex: 1;
          padding-bottom: 65px;
        }
        .tab-bar {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 54px;
          background-color: rgb(4, 35, 62);
          display: flex;
          justify-content: space-around;
          align-items: center;
          border-top: 0.5px solid #ccc;
          z-index: 1000;
        }
        .tab-btn {
          flex: 1;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 5px 0;
          text-align: center;
        }
        .tab-item {
          color: white;
          font-size: 10px;
          font-weight: 600;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          transition: color 0.18s ease-in-out;
          opacity: 0.85;
        }
        .tab-item.active {
          color: rgb(239, 217, 18);
          opacity: 1;
        }

        /* ⭐ JUMP + RETURN ANIMATION */
        @keyframes tabBounce {
          0% { transform: translateY(0); }
          40% { transform: translateY(-4px); }
          100% { transform: translateY(0); }
        }
        .tab-item.clicked {
          animation: tabBounce 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default MainTabs;
