import Header from "@components/dashboard/Header";
import React, { FC, useEffect, useState } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from "react-native-reanimated";

const DivBase = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => (
  <div ref={ref} {...props}>
    {children}
  </div>
));

const AnimatedDiv = Animated.createAnimatedComponent(DivBase);

const AnimatedHeader: FC = () => {
  const scrollY = useSharedValue(0);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleScroll = () => {
      scrollY.value = withTiming(window.scrollY || 0, { duration: 120 });
    };

    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, 150], [1, 0.97], "clamp");

    const scale = interpolate(scrollY.value, [0, 200], [1, 0.98], "clamp");

    const shadowOpacity = interpolate(
      scrollY.value,
      [0, 150],
      [0.05, 0.15],
      "clamp"
    );

    return {
      opacity,
      transform: [{ scale }],
      boxShadow: `0 4px 16px rgba(0,0,0,${shadowOpacity})`,
    };
  });

  return (
    <AnimatedDiv
      style={{
        position: "sticky",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 999,
        backgroundColor: isDesktop ? "rgba(0,168,132,0.95)" : "#00a884",
        backdropFilter: isDesktop ? "blur(6px)" : "none",
        transition: "background-color 0.2s ease",
        ...headerAnimatedStyle,
      }}
    >
      <Header />
    </AnimatedDiv>
  );
};

export default AnimatedHeader;