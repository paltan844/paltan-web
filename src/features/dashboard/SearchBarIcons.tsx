import React, { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaMicrophone, FaSearch } from "react-icons/fa";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from "react-native-reanimated";

// ✅ Step 1: Base div for animation on web
const DivBase = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, ...props }, ref) => (
    <div ref={ref} {...props}>
      {children}
    </div>
  )
);

// ✅ Step 2: Convert it to Animated component
const AnimatedDiv = Animated.createAnimatedComponent(DivBase);

const SearchBarIcons: FC = () => {
  const navigate = useNavigate();
  const scrollY = useSharedValue(0);

  // ✅ Track scroll to trigger animation
  useEffect(() => {
    const handleScroll = () => {
      scrollY.value = withTiming(window.scrollY || 0, { duration: 150 });
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ Animation (fade + slide-in)
  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [80, 150, 250], [0, 0.6, 1], "clamp");
    const translateY = interpolate(scrollY.value, [80, 150, 250], [20, 10, 0], "clamp");
    return { opacity, transform: [{ translateY }] };
  });

  return (
    <AnimatedDiv
      style={[
        {
          position: "fixed" as any,
          top: 20,
          left: 10,
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(0,0,0,0.5)",
          borderRadius: 12,
          padding: 7,
          gap: 7,
          boxShadow: "0 3px 10px rgba(0,0,0,0.25)",
          transition: "opacity 0.3s ease, transform 0.3s ease",
        },
        animatedStyle,
      ]}
    >
      <div
        onClick={() => navigate("/SearchScreen")}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff",
          borderRadius: "50%",
          width: 25,
          height: 25,
          cursor: "pointer",
          transition: "transform 0.2s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <FaSearch color="#e80000" size={15} />
      </div>

      {/* 🎤 Mic Icon */}
      <div
        onClick={() => alert("Voice Search Coming Soon 🎤")}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff",
          borderRadius: "50%",
          width: 25,
          height: 25,
          cursor: "pointer",
          transition: "transform 0.2s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <FaMicrophone color="#e80000" size={15} />
      </div>
    </AnimatedDiv>
  );
};

export default SearchBarIcons;
