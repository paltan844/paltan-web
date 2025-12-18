import {
  View, StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  BackHandler,
} from "react-native";
import React, { FC, useEffect } from "react";
import { useAuthStore } from "@state/authStore";
import { getOrderById } from "@service/orderService";
import { Colors, Fonts } from "@utils/Constants";
import LiveHeader from "./LiveHeader";
import CustomText from "@components/ui/CustomText";
import DeliveryDetails from "./DeliveryDetails";
import OrderSummary from "./OrderSummary";
import withLiveStatus from "./withLiveStatus";

import { Phone, ShoppingBag, MapPin } from "lucide-react";
import { useFocusEffect } from "@react-navigation/native";
import { navigate } from "@utils/NavigationUtils";

const LiveTracking: FC = () => {
  const { currentOrder, setCurrentOrder } = useAuthStore();

  const fetchOrderDetails = async () => {
    const data = await getOrderById(currentOrder?._id as any);
    setCurrentOrder(data);
  };


  
  useEffect(() => {
    fetchOrderDetails();
  }, []);
useEffect(() => {
    if (Platform.OS === "web") return;

    const onBackPress = () => {
      navigate("MainTabs");

      if (currentOrder?.status === "delivered") {
        setCurrentOrder(null);
      }

      return true; 
    };

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress
    );

    return () => subscription.remove();
  }, [currentOrder]);



  let msg = "Packing your order";
  let time = "Arriving same day";

  if (currentOrder?.status === "confirmed") {
    msg = "Arriving Soon";
    time = "Arriving in minutes";
  } else if (currentOrder?.status === "arriving") {
    msg = "Your rider is on the way";
    time = "Arriving in minutes";
  } else if (currentOrder?.status === "delivered") {
    msg = "Order Delivered";
    time = "Fastest Delivery ⚡";
  }

  return (
    <View style={styles.Container}>
      <LiveHeader type="customer" title={msg} secondTitle={time} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
 
        <View style={styles.flexRow}>
          <View style={styles.stylishIconBox}>
            {currentOrder?.deliveryPartner ? (
              <Phone size={22} strokeWidth={1.5} color="#6c6c6c" />
            ) : (
              <ShoppingBag size={22} strokeWidth={1.5} color="#6c6c6c" />
            )}
          </View>

          <View style={{ width: "82%" }}>
            <CustomText
              numberOfLines={1}
              variant="h7"
              fontFamily={Fonts.SemiBold}
            >
              {currentOrder?.deliveryPartner?.name ||
                "We will soon assign delivery partner"}
            </CustomText>

            {currentOrder?.deliveryPartner && (
              <CustomText variant="h7" fontFamily={Fonts.Medium}>
                {currentOrder?.deliveryPartner?.phone}
              </CustomText>
            )}

            <CustomText
              variant="h9"
              fontFamily={Fonts.Medium}
              style={{ color: "#666" }}
            >
              {currentOrder?.deliveryPartner
                ? "For Delivery Instructions you can contact here"
                : msg}
            </CustomText>
          </View>
        </View>

     
        {(currentOrder?.status !== "arriving" ||
          currentOrder?.status !== "delivered" ||
          currentOrder?.status === "confirmed") && (
          <View style={styles.addressBox}>
            <View style={styles.stylishPinBox}>
              <MapPin size={20} color="green" strokeWidth={2} />
            </View>

            <View style={{ width: "82%" }}>
              <CustomText variant="h7" fontFamily={Fonts.SemiBold}>
                Change Address or Receiver Details
              </CustomText>

              <CustomText
                variant="h9"
                fontFamily={Fonts.Medium}
                style={{ color: "#555", marginTop: 2 }}
              >
                You can update before your order is dispatched.
              </CustomText>

              <TouchableOpacity activeOpacity={0.7}>
                <CustomText
                  variant="h8"
                  style={{ color: "green", marginTop: 5, fontWeight: "600" }}
                >
                  Change Address
                </CustomText>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <DeliveryDetails details={currentOrder?.deliveryLocation} />

        <OrderSummary order={currentOrder} />

        <CustomText
          variant="h6"
          fontFamily={Fonts.SemiBold}
          style={{ opacity: 0.6, marginTop: 10, textAlign: "center" }}
        >
          Powered By Paltan
        </CustomText>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: Colors.secondary,
  },
  scrollContent: {
    paddingBottom: 60,
    padding: 10,
    backgroundColor: Colors.backgroundSecondary,
  },

  flexRow: {
    marginTop: 15,
    backgroundColor: "#fff",
    paddingVertical: 10,
    padding: 12,
    width: "100%",
    borderRadius: 15,
    borderColor: Colors.border,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderBottomWidth: 1,
  },

  stylishIconBox: {
    height: 45,
    width: 45,
    borderRadius: 12,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
  },

  stylishPinBox: {
    height: 45,
    width: 45,
    borderRadius: 50,
    backgroundColor: "#e0f7e9",
    alignItems: "center",
    justifyContent: "center",
  },

  addressBox: {
    marginTop: 10,
    backgroundColor: "#f9fafb",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
});

export default withLiveStatus(LiveTracking);
