// src/features/map/withLiveStatus.tsx
import React, { FC, useCallback, useEffect, useState } from "react";
import { Image, TouchableOpacity, View, StyleSheet, Platform } from "react-native";
import CustomText from "@components/ui/CustomText";
import { Colors, Fonts } from "@utils/Constants";
import { hocStyles } from "@styles/globalStyles";
import { SOCKET_URL } from "@service/config";
import { getOrderById } from "@service/orderService";
import { useAuthStore } from "@state/authStore";
import { navigate } from "@utils/NavigationUtils";
import io from "socket.io-client";

// Only import navigation for native — not web
let useFocusEffect: any = () => {};
let useNavigationState: any = () => {};
if (Platform.OS !== "web") {
  const nav = require("@react-navigation/native");
  useFocusEffect = nav.useFocusEffect;
  useNavigationState = nav.useNavigationState;
}

const withLiveStatus = <P extends object>(
  WrappedComponent: React.ComponentType<P>
): FC<P> => {
  const WithLiveStatusComponent: FC<P> = (props) => {
    const { currentOrder, setCurrentOrder } = useAuthStore();
    const [_refreshToggle, setRefreshToggle] = useState(false);

    // ✅ Skip logic entirely on web
    if (Platform.OS === "web") {
      return <WrappedComponent {...props} />;
    }

    const routeName = useNavigationState(
      (state: any) => state.routes[state.index]?.name
    );

    const fetchOrderDetails = async () => {
      if (!currentOrder?._id) return;
      try {
        const data = await getOrderById(currentOrder._id);
        setCurrentOrder(data || null);
        setRefreshToggle((prev) => !prev);
      } catch {
        setCurrentOrder(null);
      }
    };

    useFocusEffect(
      useCallback(() => {
        if (routeName === "Kart" && currentOrder?._id) fetchOrderDetails();
      }, [routeName, currentOrder?._id])
    );

    useEffect(() => {
      if (!currentOrder?._id) return;
      const socketInstance = io(SOCKET_URL, { transports: ["websocket"] });
      socketInstance.emit("joinRoom", currentOrder._id);
      socketInstance.on("liveTrackingUpdates", fetchOrderDetails);
      socketInstance.on("orderConfirmed", fetchOrderDetails);
      return () => socketInstance.disconnect();
    }, [currentOrder?._id]);

    return (
      <View style={styles.Container}>
        <WrappedComponent {...props} />
        {currentOrder &&
          currentOrder.status !== "cancelled" &&
          currentOrder.status !== "delivered" &&
          routeName === "Kart" && (
            <View
              style={[
                hocStyles.cartcontainer,
                { flexDirection: "row", alignItems: "center" },
              ]}
            >
              <View style={styles.flexRow}>
                <View style={styles.img}>
                  <Image
                    source={require("@assets/icons/bucket.png")}
                    style={{ width: 20, height: 20 }}
                  />
                </View>

                <View style={{ width: "68%" }}>
                  <CustomText variant="h7" fontFamily={Fonts.SemiBold}>
                    Order is {currentOrder?.status}
                  </CustomText>

                  <CustomText variant="h7" fontFamily={Fonts.Medium}>
                    {currentOrder?.items?.length
                      ? `${currentOrder.items[0]?.item?.name || "Unnamed Product"}${
                          currentOrder.items.length - 1 > 0
                            ? ` and ${currentOrder.items.length - 1}+ items`
                            : ""
                        }`
                      : "No items"}
                  </CustomText>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => navigate("LiveTracking")}
                style={styles.btn}
              >
                <CustomText
                  variant="h8"
                  style={{ color: Colors.secondary }}
                  fontFamily={Fonts.Medium}
                >
                  View
                </CustomText>
              </TouchableOpacity>
            </View>
          )}
      </View>
    );
  };

  return WithLiveStatusComponent;
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
  flexRow: {
    marginBottom: 5,
    paddingVertical: 7,
    padding: 10,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  img: {
    borderRadius: 100,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "rgba(234, 231, 231, 1)",
  },
  btn: {
    paddingVertical: 2,
    paddingHorizontal: 10,
    padding: 10,
    borderWidth: 0.7,
    borderRadius: 5,
    borderColor: Colors.secondary,
  },
});

export default withLiveStatus;
