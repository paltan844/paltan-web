/*
import React, { FC } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import CustomText from "@components/ui/CustomText";
import { Fonts } from "@utils/Constants";
import { formatOrderDate } from "@utils/DateUtils";

interface CartItem {
  _id: string | number;
  item: any;
  count: number;
}

interface Order {
  orderId: string;
  items: CartItem[];
  finalAmount: number;
  createdAt: string;
  status: "confirmed" | "completed" | "cancelled" | "delivered" | "available" | "arriving";
  hasReturn?: boolean;
  returnStatus?: "requested" | "approved" | "completed";
  canReturn?: boolean;  
}

const statusColors: Record<string, { bg: string; text: string }> = {
  confirmed: { bg: "#FFF8E1", text: "#FFA000" },
  delivered: { bg: "#E8F5E9", text: "#4CAF50" },
  cancelled: { bg: "#FFEBEE", text: "#D32F2F" },
  available: { bg: "#FFF3E0", text: "#FB8C00" },
  arriving: { bg: "#E3F2FD", text: "#1E88E5" },
};

const returnColors = {
  border: "#E53935", // Blinkit red
  text: "#E53935",
};

const OrderItem: FC<{ item: Order; index: number; onPress?: () => void }> = ({
  item,
  onPress,
}) => {
  const {
    orderId,
    items,
    finalAmount,
    createdAt,
    status,
    hasReturn,
    returnStatus,
  } = item;
console.log("🟢 Kart Order:", item.orderId, item.canReturn);

  const safeAmount = Number(finalAmount ?? 0);
  const colors = statusColors[status] || { bg: "#F5F5F5", text: "#757575" };

  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(safeAmount);

  const isTouchable = status === "delivered";
  const Wrapper = isTouchable ? TouchableOpacity : View;
  const wrapperProps = isTouchable ? { onPress } : {};

  /* ---------------------------------------
     🔁 RETURN LABEL LOGIC
  --------------------------------------- /
 let returnLabel: string | null = null;

if (status === "delivered") {
  // ✅ If return already exists → always show status
  if (hasReturn) {
    if (returnStatus === "approved" || returnStatus === "completed") {
      returnLabel = "Confirm Return";
    } else {
      returnLabel = "Request Return";
    }
  }
  else if (item.canReturn) {
    returnLabel = "Return";
  }
}


  return (
    <Wrapper style={[styles.card, { backgroundColor: colors.bg }]} {...wrapperProps}>
      <View style={styles.rowBetween}>
        <CustomText variant="h9" fontFamily={Fonts.Medium}>
          #{orderId}
        </CustomText>
        
        <View style={styles.statusRow}>
          {returnLabel && (
            <View style={[styles.statusTag, styles.returnTag]}>
              <CustomText
                variant="h9"
                fontFamily={Fonts.Medium}
                style={{ color: returnColors.text }}
              >
                {returnLabel}
              </CustomText>
            </View>
          )}

          <View style={[styles.statusTag, { borderColor: colors.text }]}>
            <CustomText
              variant="h9"
              fontFamily={Fonts.Medium}
              style={{ color: colors.text, textTransform: "capitalize" }}
            >
              {status}
            </CustomText>
          </View>
        </View>
      </View>

      {/* ITEMS + PRICE /}
      <View style={[styles.rowBetween, { marginTop: 10 }]}>
        <View style={{ width: "55%" }}>
          {items.map(({ item: product, count }, idx) => {
            if (!product) return null;

            const price =
              parseFloat(product?.discountprice) > 0
                ? parseFloat(product?.discountprice)
                : parseFloat(product?.price);

            return (
              <View key={idx} style={styles.backItem}>
                <CustomText
                  variant="h9"
                  fontFamily={Fonts.Medium}
                  numberOfLines={2}
                >
                  {count}x {product?.name || "Unnamed Product"} : ₹
                  {new Intl.NumberFormat("en-IN", {
                    maximumFractionDigits: 0,
                  }).format(price)}
                </CustomText>
              </View>
            );
          })}
        </View>

        <View style={{ alignItems: "flex-end" }}>
          <CustomText variant="h5" fontFamily={Fonts.SemiBold}>
            {formattedPrice}
          </CustomText>
          <CustomText variant="h8" style={{ opacity: 0.7 }}>
            {formatOrderDate(createdAt, false, false)}
          </CustomText>
        </View>
      </View>
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  backItem: {
    backgroundColor: "rgba(212, 178, 178, 0.16)",
    borderRadius: 8,
    padding: 6,
    marginBottom: 4,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 10,
    elevation: 2,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  statusTag: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },

  returnTag: {
    borderColor: returnColors.border,
  },
});

export default OrderItem;
*/

import React, { FC } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import CustomText from "@components/ui/CustomText";
import { Fonts } from "@utils/Constants";
import { formatOrderDate } from "@utils/DateUtils";

interface CartItem {
  _id: string | number;
  item: any;
  count: number;
}

interface Order {
  orderId: string;
  items: CartItem[];
  finalAmount: number;
  createdAt: string;
  status: "confirmed" | "completed" | "cancelled" | "delivered" | "available" | "arriving";
  hasReturn?: boolean;
  returnStatus?: "requested" | "approved" | "completed";
  canReturn?: boolean;  
}

const statusColors: Record<string, { bg: string; text: string }> = {
  confirmed: { bg: "#FFF8E1", text: "#FFA000" },
  delivered: { bg: "#E8F5E9", text: "#4CAF50" },
  cancelled: { bg: "#FFEBEE", text: "#D32F2F" },
  available: { bg: "#FFF3E0", text: "#FB8C00" },
  arriving: { bg: "#E3F2FD", text: "#1E88E5" },
};

const returnColors = {
  border: "#E53935", // Blinkit red
  text: "#E53935",
};

const OrderItem: FC<{ item: Order; index: number; onPress?: () => void }> = ({
  item,
  onPress,
}) => {
  const {
    orderId,
    items,
    finalAmount,
    createdAt,
    status,
    hasReturn,
    returnStatus,
  } = item;
console.log("🟢 Kart Order:", item.orderId, item.canReturn);

  const safeAmount = Number(finalAmount ?? 0);
  const colors = statusColors[status] || { bg: "#F5F5F5", text: "#757575" };

  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(safeAmount);

  const isTouchable = status === "delivered";
  const Wrapper = isTouchable ? TouchableOpacity : View;
  const wrapperProps = isTouchable ? { onPress } : {};

  /* ---------------------------------------
     🔁 RETURN LABEL LOGIC
  --------------------------------------- */
 let returnLabel: string | null = null;

if (status === "delivered") {
  // ✅ If return already exists → always show status
  if (hasReturn) {
    if (returnStatus === "approved" || returnStatus === "completed") {
      returnLabel = "Confirm Return";
    } else {
      returnLabel = "Request Return";
    }
  }
  else if (item.canReturn) {
    returnLabel = "Return";
  }
}


  return (
    <Wrapper style={[styles.card, { backgroundColor: colors.bg }]} {...wrapperProps}>
      <View style={styles.rowBetween}>
        <CustomText variant="h9" fontFamily={Fonts.Medium}>
          #{orderId}
        </CustomText>
        
        <View style={styles.statusRow}>
          {returnLabel && (
            <View style={[styles.statusTag, styles.returnTag]}>
              <CustomText
                variant="h9"
                fontFamily={Fonts.Medium}
                style={{ color: returnColors.text }}
              >
                {returnLabel}
              </CustomText>
            </View>
          )}

          <View style={[styles.statusTag, { borderColor: colors.text }]}>
            <CustomText
              variant="h9"
              fontFamily={Fonts.Medium}
              style={{ color: colors.text, textTransform: "capitalize" }}
            >
              {status}
            </CustomText>
          </View>
        </View>
      </View>

      {/* ITEMS + PRICE */}
      <View style={[styles.rowBetween, { marginTop: 10 }]}>
        <View style={{ width: "55%" }}>
          {items.map(({ item: product, count }, idx) => {
            if (!product) return null;

            const price =
              parseFloat(product?.discountprice) > 0
                ? parseFloat(product?.discountprice)
                : parseFloat(product?.price);

            return (
              <View key={idx} style={styles.backItem}>
                <CustomText
                  variant="h9"
                  fontFamily={Fonts.Medium}
                  numberOfLines={2}
                >
                  {count}x {product?.name || "Unnamed Product"} : ₹
                  {new Intl.NumberFormat("en-IN", {
                    maximumFractionDigits: 0,
                  }).format(price)}
                </CustomText>
              </View>
            );
          })}
        </View>

        <View style={{ alignItems: "flex-end" }}>
          <CustomText variant="h5" fontFamily={Fonts.SemiBold}>
            {formattedPrice}
          </CustomText>
          <CustomText variant="h8" style={{ opacity: 0.7 }}>
            {formatOrderDate(createdAt, false, false)}
          </CustomText>
        </View>
      </View>
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  backItem: {
    backgroundColor: "rgba(212, 178, 178, 0.16)",
    borderRadius: 8,
    padding: 6,
    marginBottom: 4,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 10,
    elevation: 2,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  statusTag: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },

  returnTag: {
    borderColor: returnColors.border,
  },
});

export default OrderItem;

