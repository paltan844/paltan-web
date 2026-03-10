import React, { FC, useEffect, useRef, ReactNode } from "react";
import { View, StyleSheet, Animated, Easing, Platform } from "react-native";
import { screenWidth } from "@utils/Scaling";
import { Colors, Fonts } from "@utils/Constants";
import CustomText from "@components/ui/CustomText";
import { useAuthStore } from "@state/authStore";
import { replace } from "@utils/NavigationUtils";
import { cleanAddress } from "@utils/CleanAddress";
import { formatSelectedLocation } from "@utils/AddressPreview";

interface WrapperProps {
  children: ReactNode;
}

// ⭐ Web gradient wrapper (no TS error)
const GradientBg: FC<WrapperProps> = ({ children }) => {
  if (Platform.OS === "web") {
    return (
      <div
        style={{
          minHeight: "100vh",
          width: "100%",
          background: "linear-gradient(135deg, #00C853, #009624)",
          display: "flex",
        }}
      >
        <div style={{ flex: 1, display: "flex" }}>{children}</div>
      </div>
    );
  }

  // Mobile fallback (simple solid color)
  return <View style={{ flex: 1, backgroundColor: "#009624" }}>{children}</View>;
};

const OrderSuccess: FC = () => {
  const { user } = useAuthStore();

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 90,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    const t = setTimeout(() => replace("/livetracking"), 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <GradientBg>
      <View style={styles.Container}>
        {/* Animated Circle */}
        <Animated.View
          style={[
            styles.circle,
            {
              transform: [{ scale: scaleAnim }],
              opacity: fadeAnim,
            },
          ]}
        >
          <CustomText style={styles.check} fontFamily={Fonts.SemiBold}>
            ✓
          </CustomText>
        </Animated.View>

        {/* Text Section */}
        <Animated.View style={{ opacity: fadeAnim, marginTop: 25 }}>
          <CustomText fontFamily={Fonts.SemiBold} style={styles.orderPlaceText}>
            ORDER PLACED 🎉
          </CustomText>

          <View style={styles.deliveryContainer}>
            <CustomText fontFamily={Fonts.SemiBold} style={styles.deliveryText}>
              Delivering to Home
            </CustomText>
          </View>

          <CustomText fontFamily={Fonts.Medium} style={styles.addressText}>
            {cleanAddress(formatSelectedLocation(user?.address)) ||
              "somewhere, knowhere 😃"}
          </CustomText>
        </Animated.View>
      </View>
    </GradientBg>
  );
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  circle: {
    width: screenWidth * 0.33,
    height: screenWidth * 0.33,
    borderRadius: 500,
    backgroundColor: "#00C853",
    justifyContent: "center",
    alignItems: "center",

    // Glow on Web + App
    shadowColor: "#00FF8F",
    shadowOpacity: 0.35,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  },

  check: {
    fontSize: 55,
    color: "white",
  },

  orderPlaceText: {
    fontSize: 22,
    color: "white",
    textAlign: "center",
    opacity: 0.9,
  },

  deliveryContainer: {
    paddingBottom: 3,
    borderBottomWidth: 2,
    borderColor: "#B2FF59",
    marginTop: 10,
    marginBottom: 5,
  },

  deliveryText: {
    fontSize: 18,
    color: "#E8FFE9",
    textAlign: "center",
  },

  addressText: {
    opacity: 0.9,
    textAlign: "center",
    width: "85%",
    marginTop: 10,
    color: "white",
  },
});

export default OrderSuccess;
