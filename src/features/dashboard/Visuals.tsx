// src/features/dashboard/Visuals.tsx
import React, { FC, useEffect, useState } from "react";

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

const Visuals: FC = () => {
  const [scrollY, setScrollY] = useState<number>(0);

  useEffect(() => {
    const onScroll = () => {
      setScrollY(window.scrollY || window.pageYOffset || 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const opacity = 1 - clamp(scrollY / 120, 0, 1);

  const containerStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    overflow: "hidden",
    pointerEvents: "none",
    zIndex: -1, // ✅ move it behind all content
  };

  const backgroundStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    transform: `translateY(${Math.round(scrollY * 0.05)}px)`,
    transition: "opacity 160ms linear",
    opacity,
    backgroundColor: "#dce8dcff", // your chosen color
  };

  return (
    <div style={containerStyle} aria-hidden>
      <div style={backgroundStyle} />
    </div>
  );
};

export default Visuals;
