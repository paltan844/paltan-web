import React, { FC } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Colors, Fonts } from "@utils/Constants";
import CustomText from "./CustomText";
import { RFValue } from "react-native-responsive-fontsize";
import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const TABLET_LIMIT = 900;
const isDesktop = width > TABLET_LIMIT;

let IconArrow: any;
if (Platform.OS === "web") {
  const { MdArrowForwardIos } = require("react-icons/md");
  IconArrow = MdArrowForwardIos;
} else {
  IconArrow = require("react-native-vector-icons/MaterialIcons").default;
}

interface ArrowButtonProps {
  title: string;
  onPress?: () => void;
  price?: number;
  loading?: boolean;
}

const ArrowButton: FC<ArrowButtonProps> = ({
  title,
  onPress,
  price,
  loading,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={loading}
      onPress={onPress}
      style={[
        styles.btn,
        { justifyContent: price ? "space-between" : "center" },
      ]}
    >
      {/* ✅ Price section (left side) */}
      {price !== 0 && price && (
        <View>
        <CustomText
  fontFamily={Fonts.Medium}
  fontSize={isDesktop ? 12 : 12}
  disableScaling
  style={{ color: "white" }}
>
            ₹{price.toFixed(1)}
          </CustomText>
          <CustomText
  fontFamily={Fonts.Medium}
  fontSize={isDesktop ? 11 : 10}
  disableScaling
  style={{ color: "white" }}
>
  TOTAL
</CustomText>
        </View>
      )}

      {/* ✅ Button label + arrow */}
      <View style={styles.flexRow}>
       <CustomText
  fontFamily={Fonts.Medium}
  fontSize={isDesktop ? 13 : 13}
  disableScaling
  style={{ color: "#fff" }}
>
  {title}
</CustomText>

        {loading ? (
          <ActivityIndicator
            color="white"
            style={{ marginHorizontal: 5 }}
            size="small"
          />
        ) : Platform.OS === "web" ? (
          <IconArrow
            size={10}
            color="#fff"
            style={{ marginLeft: 6, marginTop: 2 }}
          />
        ) : (
          <IconArrow name="arrow-right" color="#fff" size={RFValue(22)} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
     paddingTop: 5,
    paddingRight: 10,
    paddingBottom: 5,
    paddingLeft: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 12,
    marginVertical: 10,
    marginHorizontal: 15,
    backgroundColor: Colors.secondary,
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ArrowButton;
