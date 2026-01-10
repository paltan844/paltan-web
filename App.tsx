import React, { useEffect, useState } from "react";
import { Platform } from "react-native";
import Navigation from "./src/navigation/Navigation.web";

const App = () => {
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(true);

  useEffect(() => {
    if (Platform.OS !== "web") {
      setIsMobileOrTablet(true);
      return;
    }

    const ua = navigator.userAgent.toLowerCase();
    const isMobileUA =
      ua.includes("android") ||
      ua.includes("iphone") ||
      ua.includes("ipad") ||
      ua.includes("mobile");

    setIsMobileOrTablet(isMobileUA);

    // 🔥 GA PAGE VIEW (force)
    if (window.gtag) {
      window.gtag("event", "page_view", {
        page_location: window.location.href,
        page_path: window.location.pathname,
        page_title: document.title,
      });
    }
  }, []);

  if (!isMobileOrTablet) {
    return (
      <div style={styles.restrictedContainer}>
        <h2 style={styles.title}>🚫 Desktop Not Supported</h2>
        <p style={styles.message}>
          Please open this app on your <strong>mobile</strong> or{" "}
          <strong>tablet</strong>.
        </p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Navigation />
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#fff",
  },
  restrictedContainer: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    color: "#333",
    textAlign: "center",
    padding: "20px",
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: "#555",
  },
};

export default App;
