// src/features/map/withLiveStatus.tsx

import React, { FC, useEffect, useCallback } from "react";
import { View, Image, TouchableOpacity, StyleSheet, Platform } from "react-native";
import CustomText from "@components/ui/CustomText";
import { Colors, Fonts } from "@utils/Constants";
import { SOCKET_URL } from "@service/config";
import { getOrderById } from "@service/orderService";
import { useAuthStore } from "@state/authStore";
import { navigate } from "@utils/NavigationUtils";
import io from "socket.io-client";

// Navigation only for native
let useNavigationState: any = () => "";
let useFocusEffect: any = () => {};

if (Platform.OS !== "web") {
  const nav = require("@react-navigation/native");
  useNavigationState = nav.useNavigationState;
  useFocusEffect = nav.useFocusEffect;
}

const withLiveStatus = <P extends object>(
  WrappedComponent: React.ComponentType<P>
): FC<P> => {
  const HOC: FC<P> = (props) => {
    const { currentOrder, setCurrentOrder } = useAuthStore();

    // ---------------------------
    // GET ROUTE NAME (Web + Native)
    // ---------------------------
    const routeName =
      Platform.OS === "web"
        ? window.location.pathname.replace("/", "") // e.g. "/kart" → "kart"
        : useNavigationState(
            (state: any) => state.routes[state.index]?.name
          );

    // ---------------------------
    // FETCH ORDER WHEN OPENING KART
    // ---------------------------
    const fetchOrder = async () => {
      if (!currentOrder?._id) return;
      const data = await getOrderById(currentOrder._id);
      if (data) setCurrentOrder(data);
    };

    useFocusEffect(
      useCallback(() => {
        if (Platform.OS !== "web" && routeName === "Kart") {
          fetchOrder();
        }
      }, [routeName])
    );

    useEffect(() => {
      if (!currentOrder?._id) return;

      const socket = io(SOCKET_URL, { transports: ["websocket"] });

      socket.emit("joinRoom", currentOrder._id);
      socket.on("liveTrackingUpdates", fetchOrder);
      socket.on("orderConfirmed", fetchOrder);

      return () => socket.disconnect();
    }, [currentOrder?._id]);

    // -----------------------------------------------
    // CONDITION → SHOW THE LIVE STATUS BAR (WEB WORKING)
    // -----------------------------------------------
    const shouldShow =
      currentOrder &&
      currentOrder.status !== "cancelled" &&
      currentOrder.status !== "delivered" &&
      (routeName === "Kart" || routeName === "kart");

    return (
      <View style={{ flex: 1 }}>
        <WrappedComponent {...props} />

        {shouldShow && (
          <View style={styles.container}>
            <View style={styles.leftRow}>
              <View style={styles.iconBox}>
                <Image
                  source={{
                    uri:
                      Platform.OS !== "web"
                        ? "/images/bucket.png" // PUBLIC folder image
                        : require("@assets/icons/bucket.png"),
                  }}
                  style={{ width: 17, height: 17 }}
                  resizeMode="contain"
                />
              </View>

              <View style={{ flex: 1 }}>
                <CustomText variant="h7" fontFamily={Fonts.Bold}>
                  Order is {currentOrder?.status}
                </CustomText>

                <CustomText variant="h7" fontFamily={Fonts.Medium}>
                  {currentOrder?.items?.length
                    ? `${currentOrder.items[0]?.item?.name}${
                        currentOrder.items.length > 1
                          ? ` +${currentOrder.items.length - 1} items`
                          : ""
                      }`
                    : "No items"}
                </CustomText>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => navigate("/livetracking")}
              style={styles.btn}
            >
              <CustomText
                variant="h8"
                fontFamily={Fonts.Medium}
                style={{ color: Colors.secondary }}
              >
                View
              </CustomText>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return HOC;
};

export default withLiveStatus;

// ------------------------------------------------------
//                     STYLES
// ------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    position: "fixed",      // 🟢 Web Me Always Visible
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: "#fff",
    paddingVertical: 3,
    marginVertical: 55,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderColor: Colors.border,
    flexDirection: "row",
    alignItems: "center",
  },

  leftRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },

  iconBox: {
    width: 30,
    height: 30,
    borderRadius: 50,
    backgroundColor: "rgba(240, 229, 229, 0.8)",
    alignItems: "center",
    justifyContent: "center",
  },

  btn: {
    paddingVertical: 2,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: Colors.secondary,
  },
});
