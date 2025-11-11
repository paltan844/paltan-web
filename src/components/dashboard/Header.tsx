import React, { FC, useEffect, useState } from "react";
import { FiHome, FiBell, FiUser } from "react-icons/fi";
import { useLocationStore } from "@state/locationStore";
import { capitalizeWords, formatSelectedLocation } from "@utils/AddressPreview";
import { navigate } from "@utils/NavigationUtils";
import SearchBar from "./SearchBar";

const calculateWidth = (text: string, fontSize = 13, padding = 14) => {
  const charWidth = fontSize * 0.65;
  const contentWidth = text.length * charWidth;
  const minWidth = 80;
  const maxWidth = 160;
  return Math.min(Math.max(contentWidth + padding, minWidth), maxWidth);
};

const Header: FC = () => {
  const { selectedLocation } = useLocationStore();
  const [selectorWidth, setSelectorWidth] = useState(
    calculateWidth(capitalizeWords(selectedLocation))
  );

  useEffect(() => {
    setSelectorWidth(calculateWidth(capitalizeWords(selectedLocation)));
  }, [selectedLocation]);

  return (
    <header style={styles.header}>
      {/* Top Section */}
      <div style={styles.topRow}>
        <div>
          <h2 style={styles.title}>Delivery in minutes</h2>
          <div style={styles.selectorRow}>
            <FiHome style={styles.homeIcon} />
            <button
              onClick={() => navigate("LocationSelector")}
              style={{ ...styles.selector, width: selectorWidth }}
            >
              <span style={styles.selectorText}>
                {capitalizeWords(
                  formatSelectedLocation(selectedLocation || "Select Location")
                )}
              </span>
              <span style={styles.downArrow}>▼</span>
            </button>
          </div>
        </div>

        {/* Icons */}
        <div style={styles.iconGroup}>
          <button onClick={() => navigate("")} style={styles.iconButton}>
            <FiBell size={19} color="#fff" />
          </button>
          <button onClick={() => navigate("/profile")} style={styles.iconButton}>
            <FiUser size={19} color="#fff" />
          </button>
        </div>
      </div>

      {/* ✅ Search Bar integrated inside header */}
      <div style={styles.searchContainer}>
        <SearchBar />
      </div>
    </header>
  );
};

const styles: Record<string, React.CSSProperties> = {
  header: {
    backgroundColor: "#00a884",
    color: "#fff",
    padding: "6px 10px 1px",
    position: "sticky",
    top: 0,
    zIndex: 999,
    display: "flex",
    flexDirection: "column",
  },
  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    margin: 0,
    fontSize: "1rem",
    fontWeight: 700,
    lineHeight: 1.3,
  },
  selectorRow: {
    display: "flex",
    alignItems: "center",
    marginTop: 4,
  },
  homeIcon: {
    marginRight: 4,
    color: "rgba(255,255,255,0.7)",
  },
  selector: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F2F2F2",
    border: "none",
    borderRadius: 6,
    padding: "2px 6px",
    cursor: "pointer",
    color: "#000",
    fontWeight: 600,
    fontSize: 12.5,
    height: 19,
  },
  selectorText: {
    flex: 1,
    marginRight: 5,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  downArrow: {
    fontSize: 11,
    color: "#333",
  },
  iconGroup: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  iconButton: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: 2,
  },
  searchContainer: {
    marginTop: 5,
  },
};

export default Header;
