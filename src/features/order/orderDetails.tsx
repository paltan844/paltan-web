import React, { FC } from "react";
import { View, StyleSheet } from "react-native";
import CustomText from "@components/ui/CustomText";
import { Colors, Fonts } from "@utils/Constants";
import { formatOrderDate } from "@utils/DateUtils";

// Web + Mobile friendly icons
import {
  Hash,
  Wallet,
  MapPin,
  Clock,
  BadgeCheck,
} from "lucide-react";

interface Props {
  order: any;
}

const OrderDetails: FC<Props> = ({ order }) => {
  return (
    <View style={styles.container}>
      {/* Heading */}
      <CustomText
        fontFamily={Fonts.SemiBold}
        style={styles.heading}
        variant="h6"
      >
        Order Details
      </CustomText>

      {/* 1. Order ID */}
      <View style={styles.row}>
        <Hash size={16} color="#444" />
        <CustomText variant="h8" fontFamily={Fonts.Medium}>
          Order ID
        </CustomText>
      </View>
      <View style={styles.valueRow}>
        <CustomText variant="h8">#{order?.orderId || "—"}</CustomText>
      </View>

      {/* 2. Payment */}
      <View style={styles.row}>
        <Wallet size={16} color="#444" />
        <CustomText variant="h8" fontFamily={Fonts.Medium}>
          Payment
        </CustomText>
      </View>
      <View style={styles.valueRow}>
        <CustomText variant="h8">
          {order?.paymentType || "N/A"}
        </CustomText>
      </View>

      {/* 3. Address */}
      <View style={styles.row}>
        <MapPin size={16} color="#444" />
        <CustomText variant="h8" fontFamily={Fonts.Medium}>
          Deliver to
        </CustomText>
      </View>
      <View style={styles.valueRow}>
        <CustomText variant="h8">
          {order?.deliveryLocation?.fullAddress || "N/A"}
        </CustomText>
      </View>

      {/* 4. Order Placed */}
      <View style={styles.row}>
        <Clock size={16} color="#444" />
        <CustomText variant="h8" fontFamily={Fonts.Medium}>
          Order placed
        </CustomText>
      </View>
      <View style={styles.valueRow}>
        <CustomText variant="h8">
          {order?.createdAt
            ? formatOrderDate(order.createdAt, true, true)
            : "N/A"}
        </CustomText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    marginVertical: 15,
    padding: 14,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  heading: {
    marginBottom: 12,
    color: "#111",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
    gap: 8,
  },

  valueRow: {
    marginLeft: 24,
    marginBottom: 10,
  },
});

export default OrderDetails;
