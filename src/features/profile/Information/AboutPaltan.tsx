import React, { useEffect, useState } from "react";
import { getAboutPaltan } from "@service/productService";
import CustomHeader from "@components/ui/CustomHeader";

const AboutPaltan: React.FC = () => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInfo = async () => {
      const html = await getAboutPaltan();
      setContent(html);
      setLoading(false);
    };
    fetchInfo();
  }, []);

  if (loading)
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loader}></div>
        <p style={styles.text}>Loading content...</p>
      </div>
    );

  return (
    <div style={styles.container}>
      <CustomHeader title="Discover Paltan" />
      <div
        style={styles.htmlContainer}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#fff",
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  },
  loadingContainer: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fafafa",
  },
  loader: {
    width: 40,
    height: 40,
    border: "4px solid #ddd",
    borderTop: "4px solid #0d8320",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  text: {
    marginTop: 10,
    fontSize: 14,
    color: "#444",
  },
  htmlContainer: {
    padding: 20,
    fontSize: 15,
    lineHeight: 1.7,
    color: "#333",
  },
};

const styleSheet = document.createElement("style");
styleSheet.innerHTML = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`;
document.head.appendChild(styleSheet);

export default AboutPaltan;
