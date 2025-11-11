import React from "react";

const Shimmer: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  return <div style={{ ...styles.shimmer, ...style }} />;
};

const Skeleton: React.FC = () => {
  const renderSkeletonRow = () => (
    <div style={styles.row}>
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} style={styles.item}>
          <Shimmer style={styles.imageSkeleton} />
          <Shimmer style={styles.textSkeleton} />
        </div>
      ))}
    </div>
  );

  return (
    <div style={styles.container}>
      <Shimmer style={styles.carouselSkeleton} />
      {renderSkeletonRow()}
      {renderSkeletonRow()}
    </div>
  );
};

// inline CSS-in-JS styles
const styles: Record<string, React.CSSProperties> = {
  container: {
    margin: "20px 0",
  },
  shimmer: {
    background:
      "linear-gradient(90deg, #d3d3d3 25%, #e9e9e9 50%, #d3d3d3 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite",
    borderRadius: 5,
  },
  carouselSkeleton: {
    height: 180,
    width: "100%",
    borderRadius: 10,
    marginBottom: 20,
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  item: {
    width: "22%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  imageSkeleton: {
    width: "100%",
    height: 80,
    marginBottom: 8,
  },
  textSkeleton: {
    width: "80%",
    height: 10,
  },
};

// add shimmer keyframes to document once
if (typeof document !== "undefined" && !document.getElementById("shimmer-style")) {
  const style = document.createElement("style");
  style.id = "shimmer-style";
  style.textContent = `
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
  `;
  document.head.appendChild(style);
}

export default Skeleton;
