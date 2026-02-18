import React, { FC, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";

import CustomHeader from "@components/ui/CustomHeader";
import CustomText from "@components/ui/CustomText";
import { Colors, Fonts } from "@utils/Constants";
import { useAuthStore } from "@state/authStore";
import { navigate, replace } from "@utils/NavigationUtils";
import { createExchangeRequest } from "@service/productService";

const ReturnSummaryScreen: FC = () => {
  const { currentOrder, returnItems, clearReturnItems } = useAuthStore();

  useEffect(() => {
    console.log("🟢 ReturnSummaryScreen mounted");
    console.log("🟢 currentOrder:", currentOrder);
    console.log("🟢 returnItems:", returnItems);
  }, []);

  if (!currentOrder || !returnItems || returnItems.length === 0) {
    return (
      <View style={[styles.container, styles.center]}>
        <CustomText>No exchange data found</CustomText>
      </View>
    );
  }

  const submitExchange = async () => {
    console.log("🔥 Confirm exchange CLICKED");

    try {
      console.log("📡 Calling backend exchange API");

      await createExchangeRequest(
        currentOrder.orderId,
        returnItems
      );

      console.log("✅ Backend exchange request success");

      clearReturnItems();

      console.log("➡️ Navigating to delivered order details");
      replace("/deliveredorderdetails");
    } catch (err) {
      console.error("❌ Exchange request failed:", err);
      alert("Failed to submit exchange request");
    }
  };

  const handleConfirm = () => {
    if (Platform.OS === "web") {
    const ok = window.confirm(
  "We will attempt to replace the selected items.\n\nIf replacement is unavailable, a refund will be processed as per our return policy."
);
      if (!ok) return;
      submitExchange();
      return;
    }

    Alert.alert(
      "Confirm exchange",
      "Replacement will be attempted. If item is out of stock, refund will be processed.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Confirm", onPress: submitExchange },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <CustomHeader title="Exchange summary" />

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <CustomText fontFamily={Fonts.SemiBold}>
            Items for exchange
          </CustomText>

          {returnItems.map((item: any, index: number) => (
            <View key={index} style={styles.itemRow}>
              <CustomText>
                {item.quantity} × {item.name}
              </CustomText>
              <CustomText style={styles.subText}>
                Reason: {item.reason}
              </CustomText>
            </View>
          ))}
        </View>

        <View style={styles.infoBox}>
          <CustomText style={styles.infoText}>
            Replacement will be delivered after pickup and quality check.
            If any item is unavailable, refund will be processed automatically.
          </CustomText>
        </View>
      </ScrollView>

      {/* 🔘 CTA */}
      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.submitBtn}
          onPress={() => {
            console.log("🟢 TouchableOpacity pressed");
            handleConfirm();
          }}
        >
          <CustomText style={styles.submitText}>
            Confirm exchange
          </CustomText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  scroll: {
    padding: 16,
    paddingBottom: 120,
  },
  card: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  itemRow: {
    marginTop: 10,
  },
  subText: {
    opacity: 0.6,
    marginTop: 2,
  },
  infoBox: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoText: {
    opacity: 0.7,
    lineHeight: 18,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: Colors.backgroundSecondary,
    borderTopWidth: 1,
    borderColor: Colors.border,
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontFamily: Fonts.Medium,
  },
});

export default ReturnSummaryScreen;
