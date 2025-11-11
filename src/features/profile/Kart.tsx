// src/features/profile/Kart.tsx
import React, { FC, useState, useRef, useCallback } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import CustomHeader from "@components/ui/CustomHeader";
import WithCart from "@features/cart/WithCart";
import withLiveStatus from "@features/map/withLiveStatus";
import { withNetworkHandlerWithHeader } from "@components/common/withNetworkHandler";
import EmptyProductList from "@features/category/EmptyProductList";
import OrderItem from "@features/profile/OrderItem";
import OrderListSkeleton from "@features/profile/OrderListSkeleton";
import NoConnectionScreen from "@components/common/NetworkHandler";
import { useAuthStore } from "@state/authStore";
import { fetchCustomerOrdersNeeds } from "@service/orderService";
import { navigate } from "@utils/NavigationUtils";

/**
 * Kart screen — shows all customer orders with live status (on native)
 * and order OTPs for active orders.
 */

interface Props {
  isConnected?: boolean;
  onRetry?: () => void;
}

const Kart: FC<Props> = ({ isConnected, onRetry }) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState<boolean>(false);
  const { user } = useAuthStore();
  const hasFocusedOnce = useRef(false);

  const fetchOrders = async () => {
  try {
    setOrdersLoading(true);

    // ✅ 1️⃣ Check if user is logged in
    if (!user || !user._id) {
      console.warn("User not logged in — redirecting to login");
      setOrders([]); // clear existing orders
      Alert.alert(
        "Login Required",
        "Please login to view your orders.",
        [
          {
            text: "OK",
            onPress: () => navigate("/login"), // ✅ works for web route or CustomerLogin
          },
        ]
      );
      return;
    }

    // ✅ 2️⃣ Proceed only if user exists
    const data = await fetchCustomerOrdersNeeds(user._id);
    setOrders(Array.isArray(data) ? data : []);
  } catch (error: any) {
    console.warn("Error fetching orders:", error?.message || error);

    // ✅ 3️⃣ Handle unauthorized error gracefully
    if (
      error?.response?.status === 401 ||
      error?.message?.includes("Access token required")
    ) {
      Alert.alert(
        "Login Required",
        "Your session has expired or you are not logged in.",
        [
          {
            text: "Login",
            onPress: () => navigate("/login"),
          },
        ]
      );
    } else {
      Alert.alert(
        "Error",
        "Unable to load orders at the moment. Please try again later."
      );
    }
  } finally {
    setOrdersLoading(false);
  }
};


  /* ✅ Platform-Specific Focus Handling:
     useFocusEffect only exists on native — for web, just useEffect.
  */
  React.useEffect(() => {
    if (Platform.OS === "web") {
      fetchOrders();
    }
  }, [user?._id]);

  // For native, useFocusEffect from @react-navigation/native
  if (Platform.OS !== "web") {
    const { useFocusEffect } = require("@react-navigation/native");
    useFocusEffect(
      useCallback(() => {
        if (!hasFocusedOnce.current) {
          fetchOrders();
          hasFocusedOnce.current = true;
        }
        return () => {
          hasFocusedOnce.current = false;
        };
      }, [user?._id])
    );
  }

  /* ---------- Render order list ---------- */

  const renderOrders = ({ item, index }: any) => {
    const handlePress = () => {
      if (item.status === "delivered") {
        useAuthStore.getState().setCurrentOrder(item);
        navigate("DeliveredOrderDetails");
      }
    };
    return (
      <OrderItem
        item={item}
        index={index}
        onPress={item.status === "delivered" ? handlePress : undefined}
      />
    );
  };

  // Filter active orders with OTPs
  const activeOrders = (orders || []).filter(
    (o: any) => o.status !== "delivered" && o.otp
  );

  const renderOtp = ({ item }: any) => (
    <View style={styles.otpCard}>
      <Text style={styles.otpLabel}>Order #{item.orderId}</Text>
      <Text style={styles.otpCode}>{item.otp}</Text>
    </View>
  );

  /* ---------- Main UI ---------- */

  return (
    <View style={styles.mainContainer}>
      <CustomHeader title="Kart" search />

      {!isConnected ? (
        <NoConnectionScreen onRetry={onRetry || fetchOrders} />
      ) : ordersLoading ? (
        <OrderListSkeleton />
      ) : orders.length > 0 ? (
        <>
          {activeOrders.length > 0 && (
            <View style={styles.otpContainer}>
              <Text style={styles.otpHeader}>Active Order OTPs</Text>
              <FlatList
                data={activeOrders}
                keyExtractor={(item: any) => item.orderId}
                renderItem={renderOtp}
                scrollEnabled={false}
                contentContainerStyle={styles.otpList}
              />
            </View>
          )}

          <FlatList
            data={orders}
            showsVerticalScrollIndicator={false}
            renderItem={renderOrders}
            keyExtractor={(item: any) => item?.orderId}
            contentContainerStyle={styles.scrollViewContent}
          />
        </>
      ) : (
        <ScrollView
          contentContainerStyle={styles.emptyContainer}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.text}>Book your first order</Text>
          <EmptyProductList />
        </ScrollView>
      )}
    </View>
  );
};

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollViewContent: {
    padding: 1,
    paddingTop: 0,
    paddingBottom: 70,
  },
  text: {
    fontSize: 12,
    fontWeight: "bold",
    color: "rgba(17, 17, 18, 0.3)",
    marginBottom: 20,
    textAlign: "center",
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  otpContainer: {
    backgroundColor: "#fef3c7",
    marginHorizontal: 12,
    marginTop: 8,
    borderRadius: 10,
    padding: 12,
  },
  otpHeader: {
    fontSize: 16,
    fontWeight: "600",
    color: "#92400e",
    marginBottom: 6,
    textAlign: "center",
  },
  otpList: {
    gap: 8,
  },
  otpCard: {
    backgroundColor: "#fff7ed",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#fdba74",
    marginBottom: 6,
  },
  otpLabel: {
    fontSize: 13,
    color: "#92400e",
    marginBottom: 2,
  },
  otpCode: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#b45309",
  },
});

/* ✅ Wrapped Export (Platform-Resolved HOCs)
   Automatically uses:
   - WithCart.tsx / .web.tsx
   - withLiveStatus.tsx / .web.tsx
*/
export default withNetworkHandlerWithHeader(
  withLiveStatus(WithCart(Kart))
);
