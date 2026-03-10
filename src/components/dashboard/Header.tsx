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
  const [isDesktop, setIsDesktop] = useState(false);
  const [selectorWidth, setSelectorWidth] = useState(
    calculateWidth(capitalizeWords(selectedLocation))
  );

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setSelectorWidth(calculateWidth(capitalizeWords(selectedLocation)));
  }, [selectedLocation]);

  return (
    <header style={styles.header}>
      <div style={styles.topRow}>
        {/* LEFT */}
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
                  formatSelectedLocation(
                    selectedLocation || "Select Location"
                  )
                )}
              </span>
              <span style={styles.downArrow}>▼</span>
            </button>
          </div>
        </div>

    <div
  style={{
    ...styles.iconGroup,
    ...(isDesktop && styles.desktopIconGroup),
  }}
>
  <button
    style={{
      ...styles.iconButton,
      ...(isDesktop && styles.desktopIconButton),
    }}
  >
    <FiBell size={isDesktop ? 25 : 19} color="#fff" />
  </button>

  <button
    onClick={() => navigate("/profile")}
    style={{
      ...styles.iconButton,
      ...(isDesktop && styles.desktopIconButton),
    }}
  >
    <FiUser size={isDesktop ? 25 : 19} color="#fff" />
  </button>
</div>
      </div>

      <div style={styles.searchContainer}>
        <SearchBar />
      </div>
    </header>
  );
};

const styles: Record<string, React.CSSProperties> = {
  iconGroup: {
  display: "flex",
  alignItems: "center",
  gap: 8, // mobile same
},

// Desktop spacing + thoda left shift
desktopIconGroup: {
  gap: 24,
  marginRight: 20, // thoda left shift karega
},

iconButton: {
  background: "transparent",
  border: "none",
  cursor: "pointer",
  padding: 2,
},

desktopIconButton: {
  backgroundColor: "rgba(255,255,255,0.18)",
  borderRadius: "50%",
  padding: 12,
  transition: "all 0.2s ease",
},
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


  searchContainer: {
    marginTop: 5,
  },
  
};


export default Header;