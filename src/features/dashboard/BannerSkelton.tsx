import React, { useEffect, useRef } from "react";

const BannerSkeleton: React.FC = () => {
  const shimmerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let animationFrame: number;
    let position = -50;

    const animate = () => {
      position += 2;
      if (position > 100) position = -50;
      if (shimmerRef.current) {
        shimmerRef.current.style.left = `${position}%`;
      }
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div style={styles.skeletonWrap}>
      <div style={styles.skeletonBox}>
        <div ref={shimmerRef} style={styles.shimmer}></div>
      </div>
    </div>
  );
};

export default BannerSkeleton;

const styles: Record<string, React.CSSProperties> = {
  skeletonWrap: {
    margin: "6px 0",
  },
  skeletonBox: {
    width: "98%",
    height: "40px",
    borderRadius: "6px",
    backgroundColor: "#e0e0e0",
    overflow: "hidden",
    position: "relative",
    margin: "0 auto",
  },
  shimmer: {
    position: "absolute",
    top: 0,
    left: "-50%",
    width: "50%",
    height: "100%",
    background:
      "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
  },
};
