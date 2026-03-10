// src/features/dashboard/Visuals.tsx
import React, { FC, useEffect, useState } from "react";

const clamp = (v: number, a: number, b: number) =>
  Math.max(a, Math.min(b, v));

const Visuals: FC = () => {
  const [scrollY, setScrollY] = useState<number>(0);
  const [isDesktop, setIsDesktop] = useState<boolean>(
    window.innerWidth >= 1024
  );

  useEffect(() => {
    const onScroll = () => {
      setScrollY(window.scrollY || window.pageYOffset || 0);
    };

    const onResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    onScroll();
    onResize();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const opacity = 1 - clamp(scrollY / 150, 0, 1);

  const containerStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: isDesktop ? 180 : 120,
    overflow: "hidden",
    pointerEvents: "none",
    zIndex: -1,
  };

  const backgroundStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    transform: `translateY(${Math.round(scrollY * (isDesktop ? 0.08 : 0.05))}px)`,
    transition: "opacity 160ms linear",
    opacity,
    background: isDesktop
      ? "linear-gradient(180deg, #dce8dcff 0%, #f4f7f4 100%)"
      : "#dce8dcff",
  };

  return (
    <div style={containerStyle} aria-hidden>
      <div style={backgroundStyle} />
    </div>
  );
};

export default Visuals;