import React, { FC } from "react";
import { View, StyleSheet } from "react-native";
import CustomText from "@components/ui/CustomText";
import { Colors, Fonts } from "@utils/Constants";
import {
  IndianRupee,
  Tag,
  Receipt,
  Bike,
  ShoppingBag,
  Store,
} from "lucide-react";

const ReportItem: FC<{
  IconComp: any;
  title: string;
  price: number;
  color?: string;
}> = ({ IconComp, title, price, color }) => {
  const isNegative = price < 0;
  const absolute = Math.abs(price);

  return (
    <View style={styles.flexRowBetween}>
      <View style={styles.flexRow}>
        <IconComp size={16} strokeWidth={1.5} color={color || "#444"} />
        <CustomText variant="h8" style={{ color: color || Colors.text }}>
          {title}
        </CustomText>
      </View>

      <CustomText
        variant="h8"
        fontFamily={Fonts.Medium}
        style={{ color: color || Colors.text }}
      >
        {isNegative ? `-₹${absolute}` : `₹${absolute}`}
      </CustomText>
    </View>
  );
};

interface AppliedOffer {
  applied: boolean;
  couponCode: string | null;
  discount: number;
  freeDelivery?: boolean;
  offer?: {
    discountType: "flat" | "percent" | "free_delivery" | "bogo" | "bank";
  };
}

const BillDetails: FC<{
  subtotal: number;
  totalMRP: number;
  productDiscount: number;
  offerDiscount: number;
  deliveryCharge: number;
  grandTotal: number;
  appliedOffer?: AppliedOffer;
}> = ({
  subtotal,
  totalMRP,
  productDiscount,
  offerDiscount,
  deliveryCharge,
  grandTotal,
  appliedOffer,
}) => {

  return (
    <View style={styles.container}>
      <CustomText fontFamily={Fonts.SemiBold} variant="h6" style={styles.heading}>
        Bill Details
      </CustomText>

      <View style={styles.billBox}>
        <ReportItem IconComp={IndianRupee} title="MRP" price={totalMRP} />

        <ReportItem
          IconComp={Tag}
          title="Product Discount"
          price={-productDiscount}
          color="green"
        />

        <ReportItem IconComp={Receipt} title="Items Total" price={subtotal} />

        {/* ✅ OFFER DISPLAY */}
        {appliedOffer?.applied && (
          <>
            {offerDiscount > 0 && (
              <ReportItem
                IconComp={Tag}
                title={`Coupon (${appliedOffer.couponCode})`}
                price={-offerDiscount}
                color="green"
              />
            )}

            {appliedOffer.freeDelivery && (
              <ReportItem
                IconComp={Bike}
                title="Free Delivery Applied"
                price={0}
                color="green"
              />
            )}

            {appliedOffer.offer?.discountType === "bogo" && (
              <ReportItem
                IconComp={ShoppingBag}
                title="Buy 1 Get 1 Free"
                price={0}
                color="green"
              />
            )}
          </>
        )}

        <ReportItem
          IconComp={Bike}
          title="Delivery Charge"
          price={deliveryCharge}
        />

        <ReportItem IconComp={Store} title="Platform Charge" price={0} />
      </View>

      <View style={styles.totalRow}>
        <CustomText fontFamily={Fonts.SemiBold} variant="h7">
          Grand Total
        </CustomText>
        <CustomText fontFamily={Fonts.SemiBold} variant="h7">
          ₹{grandTotal}
        </CustomText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    marginVertical: 15,
    backgroundColor: "#fff",
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
    justifyContent: "space-between",
    alignItems: "center",
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
    justifyContent: "space-between",
  },
});

export default BillDetails;
