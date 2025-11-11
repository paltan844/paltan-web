import React, { FC } from "react";
import { View, StyleSheet, Platform } from "react-native";
import CustomText from "@components/ui/CustomText";
import { Colors, Fonts } from "@utils/Constants";
import { RFValue } from "react-native-responsive-fontsize";

// ✅ Conditional import for icons
let Icon: any;
if (Platform.OS === "web") {
  const {
    MdCurrencyRupee,
    MdLocalOffer,
    MdArticle,
    MdPedalBike,
    MdShoppingBag,
    MdStorefront,
  } = require("react-icons/md");

  // Simple dynamic icon resolver
  const iconMap: Record<string, any> = {
    "currency-rupee": MdCurrencyRupee,
    "local-offer": MdLocalOffer,
    article: MdArticle,
    "pedal-bike": MdPedalBike,
    "shopping-bag": MdShoppingBag,
    storefront: MdStorefront,
  };

  Icon = ({ name, size, color }: any) => {
    const SelectedIcon = iconMap[name] || MdArticle;
    return <SelectedIcon size={size || 14} color={color || Colors.text} />;
  };
} else {
  Icon = require("react-native-vector-icons/MaterialIcons").default;
}

/* --------------------- ReportItem --------------------- */
const ReportItem: FC<{
  iconName: string;
  underline?: boolean;
  title: string;
  price: number;
  color?: string;
}> = ({ iconName, underline, title, price, color }) => {
  return (
    <View style={[styles.flexRowBetween, { marginBottom: 10 }]}>
      <View style={styles.flexRow}>
        <Icon
          name={iconName}
          size={RFValue(12)}
          color={color || Colors.text}
          style={{ opacity: 0.7 }}
        />
        <CustomText
          variant="h8"
          style={{
            textDecorationLine: underline ? "underline" : "none",
            textDecorationStyle: "dashed",
            color: color || Colors.text,
          }}
        >
          {title}
        </CustomText>
      </View>
      <CustomText
        variant="h8"
        style={{
          color: color || Colors.text,
        }}
      >
        ₹{price}
      </CustomText>
    </View>
  );
};

/* --------------------- BillDetails --------------------- */
const BillDetails: FC<{
  totalItemPrice: number;
  totalMRP: number;
  productDiscount: number;
}> = ({ totalItemPrice, totalMRP, productDiscount }) => {
  return (
    <View style={styles.container}>
      <CustomText fontFamily={Fonts.SemiBold} style={styles.text}>
        Bill Details
      </CustomText>

      <View style={styles.billContainer}>
        <ReportItem iconName="currency-rupee" title="MRP " price={totalMRP} />
        <ReportItem
          iconName="local-offer"
          title="Product discount"
          price={productDiscount}
          color={Colors.success}
        />
        <ReportItem iconName="article" title="Items total" price={totalItemPrice} />
        <ReportItem iconName="pedal-bike" title="Delivery charge" price={0} />
        <ReportItem iconName="shopping-bag" title="Handling charge" price={0} />
        <ReportItem iconName="storefront" title="Platform charge" price={0} />
      </View>

      <View style={[styles.flexRowBetween, { marginBottom: 15 }]}>
        <CustomText fontFamily={Fonts.SemiBold} variant="h7" style={styles.text}>
          Grand Total
        </CustomText>
        <CustomText fontFamily={Fonts.SemiBold} style={styles.text}>
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
  },
  billContainer: {
    paddingBottom: 0,
    padding: 10,
    borderColor: Colors.border,
    borderBottomWidth: 0.7,
  },
  text: {
    marginTop: 15,
    marginHorizontal: 10,
  },
  flexRowBetween: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
});

export default BillDetails;
