// src/features/dashboard/MainTabs.web.tsx
import React from "react";
import { Link, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Home, Grid, ShoppingCart, User } from "lucide-react";

import ProductDashboard from "@features/dashboard/ProductDashboard";
import CategoryList from "@features/dashboard/CategoryList";
import Kart from "@features/profile/Kart";
import Profile from "@features/profile/Profile";

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
      {/* ✅ Main tab routes */}
      <div className="tab-content">
        <Routes>
          <Route path="/" element={<ProductDashboard />} />
          <Route path="/categories" element={<CategoryList />} />
          <Route path="/kart" element={<Kart />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {/* ✅ Bottom Tab Bar — hidden on Profile */}
      {!isProfileScreen && (
        <nav className="tab-bar">
          {tabItems.map((tab) => (
            <Link key={tab.path} to={tab.path} className="tab-link">
              <div className={`tab-item ${isActive(tab.path) ? "active" : ""}`}>
                {tab.icon}
                <span>{tab.label}</span>
              </div>
            </Link>
          ))}
        </nav>
      )}

      {/* ✅ Styles */}
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
