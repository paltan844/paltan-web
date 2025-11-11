// LegalInformationScreen.web.tsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CustomHeader from "@components/ui/CustomHeader";
import { getLegalInformation } from "@service/productService";
import { Colors } from "@utils/Constants";

const LegalInformationScreen: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  // Try to get title from route state first, then query param, otherwise default
  const query = new URLSearchParams(location.search);
  const titleFromQuery = query.get("title");
  const titleFromState = (location.state as any)?.title;
  const title = titleFromState || titleFromQuery || "Legal Information";

  useEffect(() => {
    let mounted = true;
    const fetchInfo = async () => {
      try {
        const html = await getLegalInformation();
        if (mounted) {
          setContent(html || "");
        }
      } catch (err) {
        console.error("Failed to load legal information", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchInfo();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div style={styles.loaderWrap}>
        <div style={styles.loader} />
        <div style={styles.loaderText}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <CustomHeader title={title} />
      <div style={styles.container}>
        {/* render HTML from backend */}
        <div
          style={styles.htmlContainer}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
      {/* optional: back button if you want */}
      <div style={styles.footer}>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
    </div>
  );
};

export default LegalInformationScreen;

/* styles */
const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#fff",
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
    display: "flex",
    flexDirection: "column",
  },
  container: {
    padding: 10,
    flex: 1,
    maxWidth: 980,
    margin: "0 auto",
  },
  htmlContainer: {
    fontSize: 12,
    lineHeight: 1.7,
    color: "#222",
  },
  loaderWrap: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fafafa",
  },
  loader: {
    width: 44,
    height: 44,
    border: `4px solid ${Colors.border || "#ddd"}`,
    borderTop: `4px solid ${Colors.primary || "#0d8320"}`,
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loaderText: {
    marginTop: 12,
    color: "#444",
  },
  footer: {
    padding: 12,
    display: "flex",
    justifyContent: "center",
  },
  backBtn: {
    padding: "8px 12px",
    borderRadius: 8,
    border: "none",
    backgroundColor: Colors.primary,
    color: "#fff",
    cursor: "pointer",
  },
};

/* inject spinner keyframes once */
if (typeof document !== "undefined") {
  const id = "legal-screen-spin-style";
  if (!document.getElementById(id)) {
    const style = document.createElement("style");
    style.id = id;
    style.innerHTML = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }
}
