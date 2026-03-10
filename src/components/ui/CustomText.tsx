import { Colors, Fonts } from "@utils/Constants";
import { StyleSheet, Text, TextStyle, Dimensions } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import React from "react";

interface Props {
  variant?:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "h7"
    | "h8"
    | "h9"
    | "h10"
    | "body";
  fontFamily?: Fonts;
  fontSize?: number;
  disableScaling?: boolean; // ⭐ manual font control
  style?: TextStyle | TextStyle[];
  children?: React.ReactNode;
  numberOfLines?: number;
  onLayout?: (event: object) => void;
}

const TABLET_LIMIT = 900;

const CustomText: React.FC<Props> = ({
  variant = "body",
  fontFamily = Fonts.Regular,
  fontSize,
  disableScaling,
  style,
  children,
  numberOfLines,
  onLayout,
  ...props
}) => {
  const { width } = Dimensions.get("window");

  const getResponsiveSize = (size: number) => {

    // ⭐ manual control
    if (disableScaling) {
      return size;
    }

    // ⭐ freeze on desktop
    if (width > TABLET_LIMIT) {
      return RFValue(size, TABLET_LIMIT);
    }

    return RFValue(size);
  };

  let computedFontSize: number;

  switch (variant) {
    case "h1":
      computedFontSize = getResponsiveSize(fontSize || 22);
      break;

    case "h2":
      computedFontSize = getResponsiveSize(fontSize || 20);
      break;

    case "h3":
      computedFontSize = getResponsiveSize(fontSize || 18);
      break;

    case "h4":
      computedFontSize = getResponsiveSize(fontSize || 16);
      break;

    case "h5":
      computedFontSize = getResponsiveSize(fontSize || 14);
      break;

    case "h6":
      computedFontSize = getResponsiveSize(fontSize || 12);
      break;

    case "h7":
      computedFontSize = getResponsiveSize(fontSize || 12);
      break;

    case "h8":
      computedFontSize = getResponsiveSize(fontSize || 10);
      break;

    case "h9":
      computedFontSize = getResponsiveSize(fontSize || 9);
      break;

    case "h10":
      computedFontSize = getResponsiveSize(fontSize || 6);
      break;

    case "body":
    default:
      computedFontSize = getResponsiveSize(fontSize || 12);
      break;
  }

  return (
    <Text
      onLayout={onLayout}
      style={[
        styles.text,
        { color: Colors.text, fontSize: computedFontSize },
        { fontFamily },
        style,
      ]}
      numberOfLines={numberOfLines}
      {...props}
    >
      {children}
    </Text>
  );
};

export default CustomText;

const styles = StyleSheet.create({
  text: {
    textAlign: "left",
  },
});