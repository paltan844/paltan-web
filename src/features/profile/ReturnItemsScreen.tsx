import React, { FC, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import CustomHeader from "@components/ui/CustomHeader";
import CustomText from "@components/ui/CustomText";
import SimpleCheckbox from "@components/ui/Checkbox";
import { Colors, Fonts } from "@utils/Constants";
import { useAuthStore } from "@state/authStore";
import { navigate, replace } from "@utils/NavigationUtils";

const REASONS = ["Damaged", "Missing item", "Expired"];

const ReturnItemsScreen: FC = () => {
  const { currentOrder } = useAuthStore();

  /* 🛑 GUARD */
  if (!currentOrder) {
    return (
      <View style={[styles.container, styles.center]}>
        <CustomText>No order found</CustomText>
      </View>
    );
  }

  const order = currentOrder;

  const [selectedItems, setSelectedItems] = useState<any[]>([]);

  /* ---------------- HELPERS ---------------- */

  const toggleItem = (orderItem: any) => {
    setSelectedItems((prev) => {
      const exists = prev.find(
        (i) => i.itemId === orderItem.item._id
      );

      if (exists) {
        return prev.filter(
          (i) => i.itemId !== orderItem.item._id
        );
      }

      return [
        ...prev,
        {
          itemId: orderItem.item._id,
          name: orderItem.item.name,
          quantity: 1,
          reason: "Damaged",
          maxQty: orderItem.count,
        },
      ];
    });
  };

  const updateQty = (itemId: string, qty: number) => {
    setSelectedItems((prev) =>
      prev.map((i) =>
        i.itemId === itemId ? { ...i, quantity: qty } : i
      )
    );
  };

  const updateReason = (itemId: string, reason: string) => {
    setSelectedItems((prev) =>
      prev.map((i) =>
        i.itemId === itemId ? { ...i, reason } : i
      )
    );
  };

  const canContinue = selectedItems.length > 0;

  const handleContinue = () => {
    // 🔥 SAVE TO ZUSTAND (IMPORTANT)
    useAuthStore.getState().setReturnItems(selectedItems);

    // 🔥 SIMPLE NAVIGATION (NO PARAMS)
    replace("/return-summary");
  };

  return (
    <View style={styles.container}>
      <CustomHeader title="Exchange items" />

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.infoBox}>
          <CustomText style={styles.infoText}>
            Only{" "}
            <CustomText fontFamily={Fonts.SemiBold}>
              damaged items
            </CustomText>{" "}
            can be exchanged within{" "}
            <CustomText fontFamily={Fonts.SemiBold}>
              24 hours
            </CustomText>{" "}
            of delivery.
          </CustomText>
        </View>

        {order.items.map((orderItem: any) => {
          const checked = selectedItems.some(
            (i) => i.itemId === orderItem.item._id
          );

          return (
            <View key={orderItem.item._id} style={styles.itemCard}>
              <SimpleCheckbox
                checked={checked}
                onPress={() => toggleItem(orderItem)}
              />

              <View style={{ flex: 1 }}>
                <CustomText fontFamily={Fonts.Medium}>
                  {orderItem.item.name}
                </CustomText>

                <CustomText style={styles.qtyText}>
                  Ordered: {orderItem.count}
                </CustomText>

                {checked && (
                  <>
                    {/* 🔢 QUANTITY */}
                    <View style={styles.qtyRow}>
                      <CustomText>Qty:</CustomText>
                      {[...Array(orderItem.count)].map((_, idx) => {
                        const active = selectedItems.find(
                          (i) =>
                            i.itemId === orderItem.item._id &&
                            i.quantity === idx + 1
                        );

                        return (
                          <TouchableOpacity
                            key={idx}
                            style={[
                              styles.qtyBtn,
                              active && styles.qtyActive,
                            ]}
                            onPress={() =>
                              updateQty(
                                orderItem.item._id,
                                idx + 1
                              )
                            }
                          >
                            <CustomText>{idx + 1}</CustomText>
                          </TouchableOpacity>
                        );
                      })}
                    </View>

                    {/* 📝 REASON */}
                    <View style={styles.reasonRow}>
                      {REASONS.map((r) => {
                        const active = selectedItems.find(
                          (i) =>
                            i.itemId === orderItem.item._id &&
                            i.reason === r
                        );

                        return (
                          <TouchableOpacity
                            key={r}
                            style={[
                              styles.reasonChip,
                              active && styles.reasonActive,
                            ]}
                            onPress={() =>
                              updateReason(orderItem.item._id, r)
                            }
                          >
                            <CustomText>{r}</CustomText>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* 🔘 FOOTER CTA */}
      <View style={styles.footer}>
        <TouchableOpacity
          disabled={!canContinue}
          style={[
            styles.continueBtn,
            !canContinue && { opacity: 0.5 },
          ]}
          onPress={handleContinue}
        >
          <CustomText style={styles.continueText}>
            Continue
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

  infoBox: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  infoText: {
    color: Colors.textSecondary,
  },
  itemCard: {
    flexDirection: "row",
    gap: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
  },

  qtyText: {
    opacity: 0.6,
    marginTop: 2,
  },

  qtyRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 8,
    alignItems: "center",
  },
  qtyBtn: {
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  qtyActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  reasonRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
    flexWrap: "wrap",
  },
  reasonChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  reasonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
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
  continueBtn: {
    backgroundColor: Colors.primary,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  continueText: {
    color: "#fff",
    fontFamily: Fonts.Medium,
  },
});

export default ReturnItemsScreen;
