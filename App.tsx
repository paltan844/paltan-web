import React from "react";
import Navigation from "./src/navigation/Navigation.web";
import GAListener from "./src/analytics/GAListener";

const App = () => {
  const isMobileOrTablet = window.innerWidth <= 1024;

  if (!isMobileOrTablet) {
    return (
      <div style={styles.restrictedContainer}>
        <h2 style={styles.title}>🚫 Desktop Not Supported</h2>
        <p style={styles.message}>
          Please open this app on your <strong>mobile</strong> or{" "}
          <strong>tablet</strong> device.
        </p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* 🔥 GA SPA TRACKER */}
      <GAListener />

      {/* App Navigation */}
      <Navigation />
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
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
