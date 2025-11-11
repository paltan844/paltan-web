import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Mic } from "lucide-react";

const rollingTexts = [
  'Search "sweets"',
  'Search "milk"',
  'Search "ata, dal, coke"',
  'Search "chips"',
  'Search "pooja thali"',
];

const SearchBar: React.FC = () => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % rollingTexts.length);
        setFade(true);
      }, 300);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style>{`
        .searchbar-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: #f3f7f3ff;
          border: 1px solid #d1d5db;
          border-radius: 10px;
          height: 40px;
          padding: 0 12px;
          max-width: 520px;
          width: 100%;
          //margin: 6px auto;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        .searchbar-container:hover {
          background-color: #e5e7eb;
        }
        .searchbar-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #374151;
        }
        .searchbar-text {
          flex: 1;
          overflow: hidden;
          padding: 0 10px;
          display: flex;
          align-items: center;
          height: 20px;
          position: relative;
        }
        .searchbar-text span {
          position: absolute;
          white-space: nowrap;
          font-size: 14px;
          font-weight: 500;
          color: #1f2937;
          opacity: 1;
          transition: opacity 0.3s ease;
        }
        .searchbar-text span.fade-out {
          opacity: 0;
        }
        .searchbar-divider {
          width: 1px;
          height: 20px;
          background-color: #d2dbd1ff;
          margin: 0 10px;
        }
        .mic-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1px;
          border-radius: 50%;
          transition: background-color 0.2s ease;
           color: #374151;
        }
        .mic-btn:hover {
          background-color: #d1d5db;
        }

        /* 📱 Responsive */
        @media (max-width: 768px) {
          .searchbar-container {
            height: 23px;
            max-width: 94%;
          }
          .searchbar-text span {
            font-size: 12px;
          }
        }
        @media (max-width: 480px) {
          .searchbar-container {
            height: 24px;
            padding: 0 10px;
          }
          .searchbar-text span {
            font-size: 12px;
          }
        }
      `}</style>

      <div
        className="searchbar-container"
        onClick={() => navigate("/searchscreen?start=true")}
      >
        {/* 🔍 Search Icon */}
        <div className="searchbar-icon">
          <Search size={17} />
        </div>

        {/* 🔁 Rolling Text */}
        <div className="searchbar-text">
          <span className={fade ? "" : "fade-out"} key={index}>
            {rollingTexts[index]}
          </span>
        </div>

        {/* Divider */}
        <div className="searchbar-divider" />

        {/* 🎙️ Mic Icon */}
        <div
          className="mic-btn"
          onClick={(e) => {
            e.stopPropagation();
            navigate("/search?mic=true");
          }}
        >
          <Mic size={17} className="text-gray-700" />
        </div>
      </div>
    </>
  );
};

export default SearchBar;
