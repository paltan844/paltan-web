import Header from "@components/dashboard/Header";
import React, { FC, useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from "react-native-reanimated";

const DivBase = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, ...props }, ref) => (
    <div ref={ref} {...props}>
      {children}
    </div>
  )
);

const AnimatedDiv = Animated.createAnimatedComponent(DivBase);

const AnimatedHeader: FC = () => {
  const scrollY = useSharedValue(0);

  useEffect(() => {
    const handleScroll = () => {
      scrollY.value = withTiming(window.scrollY || 0, { duration: 120 });
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, 150], [1, 0.95], "clamp");
    const scale = interpolate(scrollY.value, [0, 150], [1, 0.98], "clamp");
    return { opacity, transform: [{ scale }] };
  });

  return (
    <AnimatedDiv
      style={{
        position: "sticky",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 999,
        backgroundColor: "#00a884",
        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
        ...headerAnimatedStyle,
      }}
    >
      <Header />
    </AnimatedDiv>
  );
};

export default AnimatedHeader;
