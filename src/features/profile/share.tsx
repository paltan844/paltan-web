import React, { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ use navigate from react-router-dom
import { getAppLink } from "@service/productService";
import { mmkvStorage } from "@state/storage";
import { Colors } from "@utils/Constants";

const ShareScreen: FC = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAndShare = async () => {
      let link = mmkvStorage.getItem("shared_app_link");

      if (!link) {
        link = await getAppLink();
        if (link) {
          mmkvStorage.setItem("shared_app_link", link);
        }
      }

      if (!link) {
        setLoading(false);
        return;
      }

      try {
        // ✅ Use Web Share API if available
        if (navigator.share) {
          await navigator.share({
            title: "Check out this amazing app!",
            text: "Hey! Found this cool app, thought you'd like it.",
            url: link,
          });
        } else {
          // ✅ Fallback: copy link to clipboard and alert
          await navigator.clipboard.writeText(link);
          alert(`Link copied to clipboard!\n\n${link}`);
        }
      } catch (error) {
        console.error("❌ Share error:", error);
      } finally {
        setLoading(false);
        // ✅ Navigate back to profile or home
        navigate(-1);
      }
    };

    fetchAndShare();
  }, [navigate]);

  if (loading) {
    return (
      <div style={styles.overlay}>
        <div style={styles.loader} />
        <p style={styles.text}>Preparing share link...</p>
      </div>
    );
  }

  return null;
};

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    color: "white",
    fontFamily: "system-ui, sans-serif",
  },
  loader: {
    width: "40px",
    height: "40px",
    border: `4px solid ${Colors.whitetext}`,
    borderTop: `4px solid ${Colors.primary}`,
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  text: {
    marginTop: "12px",
    fontSize: "14px",
  },
};

// ✅ Add simple spin animation for loader
const styleSheet = document.createElement("style");
styleSheet.innerHTML = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`;
document.head.appendChild(styleSheet);

export default ShareScreen;
