import React, { FC, useState, useEffect } from "react";
import { View, StyleSheet, LayoutChangeEvent, Platform } from "react-native";
import { useCartStore } from "@state/cartStore";
import CartAnimationWrapper from "./CartAnimationWrapper";
import CartSummary from "./CartSummary";

// ✅ Define all routes that show the bottom tab bar
const MAIN_TAB_PATHS = ["/", "/categories", "/kart", "/profile"];

const WithCart = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const WithCartComponent: FC<P> = (props) => {
    const cart = useCartStore((state) => state.cart);
    const cartCount = cart.reduce((acc, item) => acc + item.count, 0);
    const [footerHeight, setFooterHeight] = useState(0);
    const [isMainTabScreen, setIsMainTabScreen] = useState(false);

    const handleFooterLayout = (e: LayoutChangeEvent) => {
      setFooterHeight(e.nativeEvent.layout.height);
    };

    // ✅ Detect route on web dynamically
    useEffect(() => {
      if (Platform.OS === "web") {
        const checkRoute = () => {
          const currentPath = window.location.pathname;
          const insideMainTabs = MAIN_TAB_PATHS.some((path) =>
            currentPath === path
          );
          setIsMainTabScreen(insideMainTabs);
        };

        checkRoute();
        window.addEventListener("popstate", checkRoute);
        return () => window.removeEventListener("popstate", checkRoute);
      }
    }, []);

    return (
      <View style={styles.wrapper}>
        {/* ✅ Main content area */}
        <View style={[styles.content, { marginBottom: footerHeight }]}>
          <WrappedComponent {...props} />
        </View>

        {/* ✅ Cart summary footer */}
        {cartCount > 0 && (
          <View
            style={[
              styles.footerWrapper,
              {
                bottom:
                  Platform.OS === "web"
                    ? isMainTabScreen
                      ? 45 // show above MainTabs
                      : 0 // stick to bottom otherwise
                    : 0,
              },
            ]}
            onLayout={handleFooterLayout}
          >
            <CartAnimationWrapper cartCount={cartCount}>
              <CartSummary
                cartCount={cartCount}
                cartImage={cart?.[0]?.item?.image || null}
              />
            </CartAnimationWrapper>
          </View>
        )}
      </View>
    );
  };

  return WithCartComponent;
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#fff",
    position: "relative",
  },
  content: {
    flex: 1,
  },
  footerWrapper: {
    position: Platform.OS === "web" ? "fixed" : "absolute",
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    zIndex: 3000, // ✅ ensures it's above MainTabs (1000)
    boxShadow: Platform.OS === "web" ? "0 -2px 6px rgba(0,0,0,0.1)" : undefined,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 6,
  },
});

export default WithCart;
