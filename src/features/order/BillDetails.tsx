import React, { FC } from "react";
import { View, StyleSheet } from "react-native";
import CustomText from "@components/ui/CustomText";
import { Colors, Fonts } from "@utils/Constants";

// lucide-react icons (web + mobile safe)
import {
  IndianRupee,
  Tag,
  Receipt,
  Bike,
  ShoppingBag,
  Store,
} from "lucide-react";

/* --------------------- Single Line Item Component --------------------- */
const ReportItem: FC<{
  IconComp: any;
  underline?: boolean;
  title: string;
  price: number;
  color?: string;
}> = ({ IconComp, underline, title, price, color }) => {
  return (
    <View style={styles.flexRowBetween}>
      <View style={styles.flexRow}>
        <IconComp size={16} strokeWidth={1.5} color={color || "#444"} />
        <CustomText
          variant="h8"
          style={{
            color: color || Colors.text,
            textDecorationLine: underline ? "underline" : "none",
          }}
        >
          {title}
        </CustomText>
      </View>

      <CustomText
        variant="h8"
        fontFamily={Fonts.Medium}
        style={{ color: color || Colors.text }}
      >
        ₹{price}
      </CustomText>
    </View>
  );
};

/* --------------------- Main Bill Details --------------------- */
const BillDetails: FC<{
  totalItemPrice: number;
  totalMRP: number;
  productDiscount: number;
}> = ({ totalItemPrice, totalMRP, productDiscount }) => {
  return (
    <View style={styles.container}>
      {/* Heading */}
      <CustomText fontFamily={Fonts.SemiBold} variant="h6" style={styles.heading}>
        Bill Details
      </CustomText>

      {/* Bill Items */}
      <View style={styles.billBox}>
        <ReportItem
          IconComp={IndianRupee}
          title="MRP"
          price={totalMRP}
        />

        <ReportItem
          IconComp={Tag}
          title="Product discount"
          price={productDiscount}
          color="green"
        />

        <ReportItem
          IconComp={Receipt}
          title="Items total"
          price={totalItemPrice}
        />

        <ReportItem
          IconComp={Bike}
          title="Delivery charge"
          price={0}
        />

        <ReportItem
          IconComp={ShoppingBag}
          title="Handling charge"
          price={0}
        />

        <ReportItem
          IconComp={Store}
          title="Platform charge"
          price={0}
        />
      </View>

      {/* Grand Total */}
      <View style={styles.totalRow}>
        <CustomText fontFamily={Fonts.SemiBold} variant="h7">
          Grand Total
        </CustomText>

        <CustomText fontFamily={Fonts.SemiBold} variant="h7">
          ₹{totalItemPrice}
        </CustomText>
      </View>
    </View>
  );
};

/* --------------------- Styles --------------------- */
const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    marginVertical: 15,
    backgroundColor: "#fff",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  heading: {
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingTop: 14,
  },

  billBox: {
    padding: 14,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
    gap: 12,
  },

  flexRowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  totalRow: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

export default BillDetails;
