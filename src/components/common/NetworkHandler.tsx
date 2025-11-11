import React from "react";
import { FiCloudOff } from "react-icons/fi";

interface NoConnectionScreenProps {
  onRetry: () => void;
}

const NoConnectionScreen: React.FC<NoConnectionScreenProps> = ({ onRetry }) => {
  const styles: Record<string, React.CSSProperties> = {
    outerWrapper: {
      width: "100%",
      minHeight: "80vh", // header offset handled
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#fff",
      padding: "16px",
      boxSizing: "border-box",
    },
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      maxWidth: 400,
    },
    icon: {
      fontSize: 90,
      color: "#bbb",
      marginBottom: 16,
    },
    title: {
      fontSize: 22,
      fontWeight: 700,
      marginBottom: 8,
      color: "#222",
    },
    message: {
      fontSize: 15,
      color: "#666",
      marginBottom: 24,
      lineHeight: 1.4,
    },
    button: {
      backgroundColor: "#00a884",
      color: "#fff",
      fontWeight: 600,
      fontSize: 15,
      padding: "10px 24px",
      borderRadius: 8,
      border: "none",
      cursor: "pointer",
      transition: "background 0.3s ease",
    },
  };

  const handleHover = (e: React.MouseEvent<HTMLButtonElement>, hover: boolean) => {
    e.currentTarget.style.backgroundColor = hover ? "#008d73" : "#00a884";
  };

  return (
    <div style={styles.outerWrapper}>
      <div style={styles.container}>
        <FiCloudOff style={styles.icon} />
        <div style={styles.title}>No Internet Connection</div>
        <div style={styles.message}>
          Please check your network and try again.
        </div>
        <button
          style={styles.button}
          onMouseEnter={(e) => handleHover(e, true)}
          onMouseLeave={(e) => handleHover(e, false)}
          onClick={onRetry}
        >
          Retry
        </button>
      </div>
    </div>
  );
};

export default NoConnectionScreen;
