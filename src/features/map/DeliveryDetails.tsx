import { View, StyleSheet } from "react-native";
import React, { FC } from "react";
import { Colors, Fonts } from "@utils/Constants";
import CustomText from "@components/ui/CustomText";

// Web + Mobile friendly icons
import { Bike, User, Phone } from "lucide-react";

const DeliveryDetails: FC<{ details: any }> = ({ details }) => {
  return (
    <View style={styles.container}>
      {/* =========================
          Header Section
      ========================== */}
      <View style={styles.headerRow}>
        <View style={styles.headerIconBox}>
          <Bike size={22} strokeWidth={1.6} color="#636363" />
        </View>

        <View>
          <CustomText variant="h5" fontFamily={Fonts.SemiBold}>
            Your Delivery Details
          </CustomText>
          <CustomText
            variant="h8"
            fontFamily={Fonts.Medium}
            style={{ color: "#666" }}
          >
            Details of your current order
          </CustomText>
        </View>
      </View>

      {/* =========================
          Receiver Name + Phone (STYLISH + COMPACT)
      ========================== */}
      <View style={styles.receiverCard}>
        {/* Icon */}
        <View style={styles.receiverIconBox}>
          <User size={20} strokeWidth={1.5} color="#16a34a" />
        </View>

        {/* Texts */}
        <View style={{ flex: 1 }}>
          {/* Receiver Name */}
          <CustomText
            variant="h7"
            fontFamily={Fonts.SemiBold}
            style={{ color: "#111" }}
          >
            {details?.receiverName || "Not Assigned"}
          </CustomText>

          {/* Phone - Compact row */}
          <View style={styles.compactRow}>
            <Phone size={16} strokeWidth={1.5} color="#6b7280" />
            <CustomText
              variant="h9"
              fontFamily={Fonts.Medium}
              style={{ marginLeft: 6, color: "#555" }}
            >
              {details?.receiverMobile || "Not Available"}
            </CustomText>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    width: "100%",
    borderRadius: 15,
    marginVertical: 15,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  /* Header Style */
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
    gap: 12,
  },

  headerIconBox: {
    height: 45,
    width: 45,
    borderRadius: 12,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
  },

  /* Receiver Card */
  receiverCard: {
    padding: 14,
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 14,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  receiverIconBox: {
    height: 42,
    width: 42,
    borderRadius: 12,
    backgroundColor: "#e6fbe9",
    alignItems: "center",
    justifyContent: "center",
  },

  compactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
});

export default DeliveryDetails;
